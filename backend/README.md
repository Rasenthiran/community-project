# Hospital Management System — Backend

Production-oriented Node.js + Express + MongoDB (Atlas) backend for a hospital
appointment system with three roles — **patient**, **doctor**, **admin** — and
concurrency-safe appointment booking.

Architecture: `Route → Controller → Service → Model → MongoDB` (ES Modules throughout).

---

## 1. Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CORS_ALLOWED_ORIGINS, ADMIN_*
```

`MONGO_URI` must point to a **replica set** (any Atlas cluster, including the free M0
tier, already is one) — `Doctor` account creation uses a MongoDB transaction, which
standalone `mongod` cannot support.

Create the first admin account (idempotent — safe to re-run):

```bash
npm run seed:admin
```

Run the server:

```bash
npm run dev     # nodemon
npm start       # plain node
```

Health check: `GET http://localhost:5000/api/health`
All API routes are versioned under `http://localhost:5000/api/v1`.

---

## 2. Folder structure

```
src/
├── config/db.js
├── controllers/          # req/res/next only
├── middleware/            # auth, role, validation, rate-limit, error handling
├── models/                # User, Doctor, Appointment — schema/validation/indexes only
├── routes/                 # endpoint wiring only
├── seeders/adminSeeder.js
├── services/               # all business logic lives here
├── utils/                   # hashing, JWT, response envelope, timezone/slot math
├── validators/               # express-validator chains
├── app.js
└── server.js
```

---

## 3. Roles & account model

One `User` collection for all authentication. `role` (`patient` | `doctor` | `admin`)
is **always server-assigned**:

- Public `POST /auth/register` always creates `role: "patient"`. The client-supplied
  `role`, if any, is ignored — the request body is destructured and `role` is
  hardcoded server-side in `authService.registerUser`.
- `role: "doctor"` is only created by `POST /doctors` (admin-only), which creates a
  `User` + `Doctor` profile together in one transaction.
- `role: "admin"` is only created by `npm run seed:admin`. There is no endpoint,
  admin or otherwise, that can promote an existing user to `admin` — the generic
  `PUT /admin/users/:id` deliberately excludes `role` from its updatable fields.

`Doctor` is a professional profile (`specialization`, `availableDays`,
`workingHours`, `consultationFee`, etc.) referencing `User` via `userId` — it holds
no identity fields (name/email/phone live on `User`).

---

## 4. Appointment conflict prevention — how it actually works

This is the part worth reading before changing anything in `appointmentService.js`
or `models/Appointment.js`.

**The problem with `findOne()` then `create()`:** two concurrent booking requests
for the same doctor+slot can both read "no conflict" before either has written
anything, then both successfully insert. Checking and writing are two separate
operations with a gap between them, and the gap is exactly where the race happens.

**The fix — push the guarantee into the database, not the application:**
`Appointment` has two **partial unique indexes**:

```js
{ doctorId: 1, slotDateTime: 1 }   // unique, only for status in [pending, confirmed]
{ patientId: 1, slotDateTime: 1 }  // unique, only for status in [pending, confirmed]
```

An insert is atomic. There's no read-then-write gap because there's no separate
read — the write itself either succeeds or fails against the index. Two concurrent
requests for the same doctor+slot: exactly one `Appointment.create()` succeeds,
the other throws a MongoDB duplicate-key error (`code 11000`), no matter how
close together they arrive.

The **partial** filter (`status: {$in: ['pending','confirmed']}`) is what lets a
cancelled or rejected appointment stop blocking the slot — those documents don't
count toward the index at all, so the moment an appointment leaves the active set,
the slot is immediately rebookable.

`appointmentService.createAppointment` still runs pre-validation (doctor/patient
active, within working hours, on an available day, not in the past) before
attempting the insert — that's for a fast, specific error message, not for the
conflict guarantee itself. If the pre-check says "free" but a concurrent request
wins the race, the insert throws `11000`, which is caught and translated into an
HTTP `409 Conflict` with a message identifying which side conflicted (doctor's
slot vs. the patient's own double-booking).

**Time representation:** `appointmentDate` ('YYYY-MM-DD') + `appointmentStartTime`
('HH:mm', 24h) are the human-readable fields; `slotDateTime` (a real UTC `Date`) is
the only field conflict logic, past-checks, and sorting ever touch. It's derived
via a fixed `+05:30` offset (`utils/timeSlots.js`) — Asia/Colombo has no DST, so a
constant offset is exact, no timezone library needed.

---

## 5. Business rules implemented

| Rule | Value |
|---|---|
| Slot duration | Doctor-configurable (`slotDurationMinutes`, default 30) |
| Timezone | Asia/Colombo, stored as UTC |
| Patient cancellation | Allowed up to 2 hours before the slot |
| Doctor reject pending | Yes |
| Confirms `pending → confirmed` | Doctor (or admin override) |
| Admin override | Can force any status at any time |
| Doctor edits availability with existing bookings | Allowed; does not retroactively affect already-booked appointments |
| Doctor deactivated | Existing appointments untouched; blocks new bookings only |
| Inactive patient/doctor | Cannot participate in new bookings |
| Same patient/doctor twice same day | Allowed |
| Statuses | `pending, confirmed, completed, cancelled, rejected` |

Status transition table (`appointmentService.js`, `TRANSITIONS`):

```
pending   → confirmed   (doctor, admin)
pending   → rejected    (doctor, admin)
pending   → cancelled   (patient, doctor, admin)
confirmed → completed   (doctor, admin)
confirmed → cancelled   (patient, doctor, admin)
```
Nothing outside this table is accepted, for any role — admin's override bypasses
the table (per the confirmed rule) but still only accepts a valid enum status.

---

## 6. API reference (base `/api/v1`)

```
AUTH
POST   /auth/register                      patient only, rate-limited
POST   /auth/login                         rate-limited

SELF-SERVICE
GET    /users/me
PUT    /users/me
PUT    /users/change-password

DOCTORS (public browse)
GET    /doctors?search=&specialization=&department=&page=&limit=
GET    /doctors/:id

DOCTOR SELF-SERVICE (role: doctor)
GET    /doctors/me
PUT    /doctors/me                         biography, fee, availability, etc.

DOCTOR MANAGEMENT (role: admin)
POST   /doctors                            creates User(role=doctor) + Doctor, transactional
PUT    /doctors/:id
DELETE /doctors/:id                        deletes Doctor + linked User, transactional
PUT    /doctors/:id/status                 { isActive } — also flips the linked User

PATIENT APPOINTMENTS (role: patient)
POST   /appointments                       { doctorId, appointmentDate, appointmentStartTime, reason? }
GET    /appointments/my?status=&page=&limit=
GET    /appointments/:id
PUT    /appointments/:id/cancel            { cancellationReason? }

DOCTOR APPOINTMENTS (role: doctor)
GET    /doctor/appointments?status=&page=&limit=
GET    /doctor/appointments/:id
PUT    /doctor/appointments/:id/status     { action: confirm|reject|cancel|complete, note? }

ADMIN — USERS (role: admin)
GET    /admin/users?search=&role=&isActive=&page=&limit=
GET    /admin/users/:id
PUT    /admin/users/:id                    fullName/phoneNumber/address/city/isActive only — never role
PUT    /admin/users/:id/reset-password
PUT    /admin/users/:id/deactivate
PUT    /admin/users/:id/activate

ADMIN — APPOINTMENTS (role: admin)
GET    /admin/appointments?status=&doctorId=&patientId=&from=&to=&page=&limit=
GET    /admin/appointments/:id
PUT    /admin/appointments/:id/status      { status, note? } — can force any transition
```

Response envelope: `{ success, message, data?, errors?, pagination? }`.
Status codes: `400` validation, `401` unauthenticated, `403` forbidden, `404` not
found, `409` conflict, `500` server error.

---

## 7. Postman walkthrough — booking flow

**1. Register a patient** — `POST /auth/register`
```json
{ "fullName": "Raghav Kumar", "email": "raghav@example.com", "phoneNumber": "94771234567",
  "gender": "male", "dateOfBirth": "2002-10-18", "address": "123 Main Street", "city": "Jaffna",
  "password": "StrongPass123!", "confirmPassword": "StrongPass123!" }
```

**2. Login** — `POST /auth/login` → copy `token`.

**3. Admin creates a doctor** — `POST /doctors` (admin token)
```json
{
  "fullName": "Anusha Silva", "email": "anusha.silva@example.com", "phoneNumber": "94712345678",
  "gender": "female", "dateOfBirth": "1985-03-01", "address": "12 Hospital Rd", "city": "Colombo",
  "password": "DoctorPass123!",
  "registrationNumber": "SLMC-45213", "specialization": "Cardiology",
  "qualifications": ["MBBS", "MD (Cardiology)"], "yearsOfExperience": 12, "consultationFee": 3500,
  "department": "Cardiology", "availableDays": ["Monday", "Wednesday", "Friday"],
  "workingHours": { "startTime": "09:00", "endTime": "13:00" }, "slotDurationMinutes": 30
}
```

**4. Patient books** — `POST /appointments` (patient token)
```json
{ "doctorId": "<doctor _id from step 3>", "appointmentDate": "2026-08-19", "appointmentStartTime": "09:30",
  "reason": "Routine checkup" }
```
`2026-08-19` is a Wednesday — matches `availableDays`; `09:30` is on the 30-min grid within `09:00–13:00`.
- **201** → appointment created, `status: "pending"`.
- Repeat the exact same request immediately after → **409**, `"This doctor already has an appointment at that time"`.
- Try `appointmentStartTime: "09:15"` → **409**, off the slot grid.
- Try a Tuesday → **409**, doctor not available that day.

**5. Doctor confirms** — `PUT /doctor/appointments/:id/status` (doctor token) → `{ "action": "confirm" }`

**6. Doctor completes** — after the appointment, `{ "action": "complete" }`.

**7. Patient cancels a different, future appointment** — `PUT /appointments/:id/cancel` → **409** if inside the 2-hour window, **200** otherwise.

---

## 8. What's intentionally not in this delivery

- **Full test suite** (Phase 8 of the original plan — authorization/race-condition/
  validation/role/inactive-account tests) was scoped as a separate phase; this
  delivery covers Phases 1–7 plus baseline hardening (`helmet`, rate-limited auth
  routes). Say the word and I'll build out Jest + Supertest coverage next,
  including a concurrent-booking race test against the partial unique indexes.
- No refresh-token rotation — a single JWT with `JWT_EXPIRES_IN` (default 7d) is
  used, matching the scope of the original modules. Flag if you want short-lived
  access + refresh tokens instead.
