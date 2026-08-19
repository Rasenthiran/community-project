# Hospital Frontend — Backend-Verified API Contract

Backend inspected: `hospital-backend-updated (1)(1).zip`

## Base URL

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Health check is outside the versioned base URL:

```text
GET http://localhost:5000/api/health
```

## Authentication

All protected requests use:

```http
Authorization: Bearer <JWT>
```

JWT payload contains: `userId`, `role`, `email`.

Roles: `patient`, `doctor`, `admin`.

Public registration always creates `patient`. Doctor accounts are admin-created. Admin accounts are seeded server-side.

## Response conventions

Most success endpoints:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

`pagination` is only present for paginated lists.

### Important login exception

`POST /auth/login` returns token and user at the top level, not inside `data`:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "id": "...",
    "fullName": "...",
    "email": "...",
    "role": "patient|doctor|admin"
  }
}
```

Validation errors from express-validator may be:

```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

Other errors normally include `message`:

```json
{
  "success": false,
  "message": "..."
}
```

## AUTH

### POST `/auth/register`
Access: public. Creates patient only.

Request:

```json
{
  "fullName": "Raghav Kumar",
  "email": "raghav@example.com",
  "phoneNumber": "94771234567",
  "gender": "male",
  "dateOfBirth": "2002-10-18",
  "nationalId": null,
  "address": "123 Main Street",
  "city": "Jaffna",
  "emergencyContactName": null,
  "emergencyContactPhone": null,
  "password": "StrongPass123!",
  "confirmPassword": "StrongPass123!"
}
```

Required by validator: `fullName`, `email`, `phoneNumber`, `gender`, `dateOfBirth`, `address`, `city`, `password`, `confirmPassword`.

Password: >=8 chars, uppercase, lowercase, number, special character.

Success `data`:

```json
{
  "id": "...",
  "fullName": "...",
  "email": "...",
  "phoneNumber": "...",
  "role": "patient"
}
```

Registration does NOT return a JWT.

### POST `/auth/login`
Access: public.

Request:

```json
{ "email": "...", "password": "..." }
```

Success: top-level `token` and `user` as documented above.

## USERS — SELF SERVICE

### GET `/users/me`
Access: authenticated any role.

Returns `data` containing the User document:

- `_id`
- `fullName`
- `email`
- `phoneNumber`
- `gender`
- `dateOfBirth`
- `nationalId`
- `address`
- `city`
- `emergencyContactName`
- `emergencyContactPhone`
- `role`
- `isActive`
- `createdAt`
- `updatedAt`

### PUT `/users/me`
Access: authenticated any role.

Only these fields are actually writable:

```json
{
  "fullName": "...",
  "phoneNumber": "...",
  "address": "...",
  "city": "...",
  "emergencyContactName": "...",
  "emergencyContactPhone": "..."
}
```

Email, gender, dateOfBirth, nationalId, role and isActive are not self-updatable.

### PUT `/users/change-password`
Access: authenticated any role.

```json
{
  "currentPassword": "...",
  "newPassword": "StrongPass123!",
  "confirmPassword": "StrongPass123!"
}
```

Success has no `data`.

## DOCTORS — PUBLIC

### GET `/doctors`
Access: public.

Query params:

- `search`
- `specialization`
- `department`
- `page` >= 1
- `limit` 1..100

Important: this endpoint always filters `isActive: true`.

Success `data` is an array of Doctor documents. `userId` is populated as:

```json
{
  "_id": "doctorProfileId",
  "userId": {
    "_id": "userId",
    "fullName": "...",
    "email": "...",
    "phoneNumber": "...",
    "gender": "male|female|other"
  },
  "specialization": "...",
  "qualifications": [],
  "registrationNumber": "...",
  "yearsOfExperience": 0,
  "consultationFee": 0,
  "biography": "",
  "languages": [],
  "department": "",
  "availableDays": [],
  "workingHours": { "startTime": "09:00", "endTime": "13:00" },
  "slotDurationMinutes": 30,
  "profileImage": "",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

Pagination: `{ total, page, limit, totalPages }`.

### GET `/doctors/:id`
Access: public.

`:id` is the Doctor profile `_id`, NOT the User `_id`.

Returns the same populated doctor shape.

## DOCTOR — SELF SERVICE

### GET `/doctors/me`
Access: doctor.

Returns own Doctor profile by JWT user ID, with `userId` populated to `fullName email phoneNumber gender`.

### PUT `/doctors/me`
Access: doctor.

Only these fields are actually writable:

```json
{
  "biography": "...",
  "languages": ["English", "Tamil"],
  "consultationFee": 3500,
  "availableDays": ["Monday", "Wednesday"],
  "workingHours": { "startTime": "09:00", "endTime": "13:00" },
  "slotDurationMinutes": 30,
  "profileImage": "https://..."
}
```

Doctor cannot self-change specialization, registrationNumber, or department through this endpoint.

## ADMIN — DOCTOR MANAGEMENT

### POST `/doctors`
Access: admin.

Creates a User(role=doctor) and Doctor profile in one transaction.

Identity/account fields:

- `fullName`
- `email`
- `phoneNumber`
- `gender`
- `dateOfBirth`
- `address`
- `city`
- `password`

Professional fields:

- `registrationNumber`
- `specialization`
- `qualifications?`
- `yearsOfExperience?`
- `consultationFee?`
- `biography?`
- `languages?`
- `department?`
- `availableDays?`
- `workingHours?`
- `slotDurationMinutes?`
- `profileImage?`

### PUT `/doctors/:id`
Access: admin.

Actual service-writable fields:

- `specialization`
- `qualifications`
- `yearsOfExperience`
- `consultationFee`
- `biography`
- `languages`
- `department`
- `availableDays`
- `workingHours`
- `slotDurationMinutes`
- `profileImage`

Does not update doctor User identity fields. Use `/admin/users/:userId` for supported account fields.

### DELETE `/doctors/:id`
Access: admin.

Deletes both Doctor profile and linked User account transactionally.

### PUT `/doctors/:id/status`
Access: admin.

```json
{ "isActive": true }
```

Also mirrors status to linked User account.

### Backend limitation for Admin Doctors page

There is no admin-only "list all doctors including inactive" endpoint. `GET /doctors` is public and always returns active doctors only. Therefore an Admin Doctors management page cannot discover inactive doctor profiles from the current backend unless their IDs are already known.

## PATIENT APPOINTMENTS

### POST `/appointments`
Access: patient.

```json
{
  "doctorId": "<Doctor profile _id>",
  "appointmentDate": "YYYY-MM-DD",
  "appointmentStartTime": "HH:mm",
  "reason": "optional, max 500"
}
```

Server derives:

- `durationMinutes` from doctor's `slotDurationMinutes`
- `slotDateTime`
- initial `status: pending`

Booking rules include doctor availability day, working hours, slot grid, future time, active doctor/patient and concurrency-safe conflict rejection.

### GET `/appointments/my`
Access: patient.

Query: `status?`, `page?`, `limit?`.

`doctorId` is populated only with:

```json
{
  "_id": "...",
  "specialization": "...",
  "department": "...",
  "consultationFee": 3500
}
```

Important: doctor name is NOT included in this list response.

### GET `/appointments/:id`
Access: patient and only owner.

Important: this endpoint does not populate doctor or patient. `doctorId` and `patientId` are raw ObjectIds.

### PUT `/appointments/:id/cancel`
Access: patient and only owner.

```json
{ "cancellationReason": "optional, max 500" }
```

Patient can cancel only pending/confirmed appointments and only when at least 2 hours remain before the slot.

## DOCTOR APPOINTMENTS

### GET `/doctor/appointments`
Access: doctor.

Query: `status?`, `page?`, `limit?`.

`patientId` is populated with:

```json
{
  "_id": "...",
  "fullName": "...",
  "email": "...",
  "phoneNumber": "..."
}
```

### GET `/doctor/appointments/:id`
Access: doctor and only appointment owner doctor.

Important: this detail endpoint does not populate `patientId`; it is a raw ObjectId.

### PUT `/doctor/appointments/:id/status`
Access: doctor.

```json
{
  "action": "confirm|reject|cancel|complete",
  "note": "optional, max 500"
}
```

Transitions:

- pending -> confirmed
- pending -> rejected
- pending -> cancelled
- confirmed -> completed
- confirmed -> cancelled

When rejecting/cancelling, `note` is stored as `cancellationReason`.

## ADMIN — USERS

### GET `/admin/users`
Access: admin.

Query:

- `search?`
- `role? = patient|doctor|admin`
- `isActive? = true|false`
- `page?`
- `limit?`

Returns User array + pagination.

### GET `/admin/users/:id`
Access: admin.

Returns User document.

### PUT `/admin/users/:id`
Access: admin.

Actual writable fields:

```json
{
  "fullName": "...",
  "phoneNumber": "...",
  "address": "...",
  "city": "...",
  "isActive": true
}
```

Role cannot be changed.

### PUT `/admin/users/:id/reset-password`
Access: admin.

```json
{ "newPassword": "StrongPass123!" }
```

### PUT `/admin/users/:id/deactivate`
Access: admin. No body required.

### PUT `/admin/users/:id/activate`
Access: admin. No body required.

## ADMIN — APPOINTMENTS

### GET `/admin/appointments`
Access: admin.

Query:

- `status?`
- `doctorId?`
- `patientId?`
- `from?` ISO8601
- `to?` ISO8601
- `page?`
- `limit?`

`patientId` populated with `fullName email phoneNumber`.

`doctorId` populated only with `specialization department`.

Important: doctor User/name is NOT populated.

### GET `/admin/appointments/:id`
Access: admin.

Same population as admin list: patient identity is populated; doctor only specialization/department.

### PUT `/admin/appointments/:id/status`
Access: admin.

```json
{
  "status": "pending|confirmed|completed|cancelled|rejected",
  "note": "optional, max 500"
}
```

Admin can force any valid status. For cancelled/rejected, `note` is stored in `cancellationReason`.

## Appointment object core fields

```text
_id
patientId
doctorId
appointmentDate
appointmentStartTime
durationMinutes
slotDateTime
status
reason
cancellationReason
lastUpdatedByRole
createdAt
updatedAt
```

Statuses:

```text
pending
confirmed
completed
cancelled
rejected
```

Timezone/business timezone: Asia/Colombo (+05:30), represented in backend conflict logic via UTC `slotDateTime`.

## Recommended frontend mapper decisions

### mapUser

```js
export const mapUser = (user = {}) => ({
  id: user._id ?? user.id ?? '',
  fullName: user.fullName ?? '',
  email: user.email ?? '',
  phoneNumber: user.phoneNumber ?? '',
  gender: user.gender ?? '',
  dateOfBirth: user.dateOfBirth ?? null,
  nationalId: user.nationalId ?? null,
  address: user.address ?? '',
  city: user.city ?? '',
  emergencyContactName: user.emergencyContactName ?? '',
  emergencyContactPhone: user.emergencyContactPhone ?? '',
  role: user.role ?? '',
  isActive: user.isActive ?? true,
});
```

### mapDoctor

```js
export const mapDoctor = (doctor = {}) => ({
  id: doctor._id ?? doctor.id ?? '',
  userId: doctor.userId?._id ?? doctor.userId ?? '',
  fullName: doctor.userId?.fullName ?? '',
  email: doctor.userId?.email ?? '',
  phoneNumber: doctor.userId?.phoneNumber ?? '',
  gender: doctor.userId?.gender ?? '',
  specialization: doctor.specialization ?? '',
  qualifications: doctor.qualifications ?? [],
  registrationNumber: doctor.registrationNumber ?? '',
  yearsOfExperience: doctor.yearsOfExperience ?? 0,
  consultationFee: doctor.consultationFee ?? 0,
  biography: doctor.biography ?? '',
  languages: doctor.languages ?? [],
  department: doctor.department ?? '',
  availableDays: doctor.availableDays ?? [],
  workingHours: doctor.workingHours ?? { startTime: null, endTime: null },
  slotDurationMinutes: doctor.slotDurationMinutes ?? 30,
  profileImage: doctor.profileImage ?? '',
  isActive: doctor.isActive ?? true,
});
```

### mapAppointment

Do not assume `doctorId` or `patientId` has one fixed shape. They vary by endpoint.

```js
export const mapAppointment = (appointment = {}) => ({
  id: appointment._id ?? appointment.id ?? '',
  patientId:
    typeof appointment.patientId === 'object'
      ? appointment.patientId?._id ?? ''
      : appointment.patientId ?? '',
  patient:
    typeof appointment.patientId === 'object'
      ? {
          id: appointment.patientId?._id ?? '',
          fullName: appointment.patientId?.fullName ?? '',
          email: appointment.patientId?.email ?? '',
          phoneNumber: appointment.patientId?.phoneNumber ?? '',
        }
      : null,
  doctorId:
    typeof appointment.doctorId === 'object'
      ? appointment.doctorId?._id ?? ''
      : appointment.doctorId ?? '',
  doctor:
    typeof appointment.doctorId === 'object'
      ? {
          id: appointment.doctorId?._id ?? '',
          specialization: appointment.doctorId?.specialization ?? '',
          department: appointment.doctorId?.department ?? '',
          consultationFee: appointment.doctorId?.consultationFee ?? null,
        }
      : null,
  appointmentDate: appointment.appointmentDate ?? null,
  appointmentStartTime: appointment.appointmentStartTime ?? '',
  durationMinutes: appointment.durationMinutes ?? 0,
  slotDateTime: appointment.slotDateTime ?? null,
  status: appointment.status ?? '',
  reason: appointment.reason ?? '',
  cancellationReason: appointment.cancellationReason ?? '',
  lastUpdatedByRole: appointment.lastUpdatedByRole ?? null,
});
```

## Frontend implications / gaps to keep visible

1. The existing frontend project must be inspected before choosing `.jsx` vs `.tsx`; do not create a new Vite app just to proceed.
2. Patient appointment lists do not include doctor name.
3. Patient appointment details do not populate doctor/patient.
4. Doctor appointment detail does not populate patient.
5. Admin appointment list/detail does not include doctor name.
6. Admin cannot list inactive doctors with the current doctor listing endpoint.
7. Registration does not log the user in automatically because it returns no JWT.
8. Profile edit UIs must not present unsupported editable fields as if they can be saved.
9. No pharmacy, prescription, lab, billing, ward/bed/admission, medical-record, nurse, forgot-password-email, contact-submission, testimonial-CMS, or public-CMS APIs exist.
10. `422` is not part of the observed backend response flow; validation currently uses HTTP 400.
