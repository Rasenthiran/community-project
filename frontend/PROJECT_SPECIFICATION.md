# Hospital Management System Frontend — Complete React + Vite + Plain CSS Development Prompt

You are a **senior React frontend engineer, frontend architect, performance engineer, API integration engineer, and UI/UX designer**.

Your responsibility is to build a professional Hospital Management / Hospital Appointment Management frontend using an **already initialized React + Vite project**.

---

# 1. CRITICAL EXISTING PROJECT CONDITION

The frontend project is **ALREADY INITIALIZED using React + Vite**.

The React + Vite application already exists and runs.

However:

> **No actual application pages have been created yet.**

We are starting the application UI/pages inside the existing React + Vite project.

Therefore:

- DO NOT run `npm create vite`
- DO NOT create another React project
- DO NOT create another Vite project
- DO NOT reinitialize the application
- DO NOT replace `package.json`
- DO NOT delete the existing Vite configuration
- DO NOT unnecessarily replace existing project files
- Work inside the existing React + Vite application
- Preserve the current JavaScript/TypeScript choice of the project

Before creating pages:

1. Inspect `package.json`
2. Inspect installed dependencies
3. Inspect React version
4. Inspect Vite version
5. Inspect whether the project uses JavaScript or TypeScript
6. Inspect `vite.config.js` or `vite.config.ts`
7. Inspect `src/main.jsx` / `src/main.tsx`
8. Inspect `src/App.jsx` / `src/App.tsx`
9. Install ONLY packages that are missing

If the current project uses:

```
.js
.jsx

```

continue using JavaScript/JSX.

Do NOT convert the whole application to TypeScript unless explicitly requested.

---

# 2. IMPORTANT STYLING RULE — NO TAILWIND

We are **NOT using Tailwind CSS**.

Do NOT:

- Install Tailwind CSS
- Configure Tailwind
- Use Tailwind classes
- Use `@tailwind`
- Use Tailwind utility classes
- Use Bootstrap
- Use Material UI for general layout/styling
- Use styled-components
- Use Emotion
- Introduce Sass unless explicitly requested

Use:

> **Plain CSS files only.**

The project should use clean, maintainable standard CSS.

---

# 3. REQUIRED PACKAGE CHECK

Before installing anything, inspect:

```
npm list --depth=0

```

and inspect:

```
package.json

```

Do not reinstall packages that already exist.

---

# 4. REQUIRED FRONTEND PACKAGES

Install only packages that are not already installed.

## Routing

```
npm install react-router

```

Use React Router for SPA navigation and role-based routes.

---

## Axios

```
npm install axios

```

Use Axios through ONE centralized Axios instance.

---

## TanStack Query

```
npm install @tanstack/react-query

```

Use for:

- API queries
- API caching
- Mutations
- Loading states
- Retry
- Query invalidation
- Request deduplication
- Refetching
- Server-state management

Avoid random API fetching patterns spread throughout components.

---

## React Hook Form

```
npm install react-hook-form

```

---

## Zod Validation

```
npm install zod @hookform/resolvers

```

Use Zod schemas separately from page components.

---

## Animation

```
npm install motion

```

Use:

```
import { motion } from "motion/react";

```

Use animation for:

- Hero section
- Scroll animations
- Section reveal
- Card entrance
- Mobile navigation
- Modal animation
- CTA interactions
- Counters
- Page transitions where useful

---

## Icons

```
npm install lucide-react

```

Import individual icons.

---

## Toast Notifications

```
npm install sonner

```

Use centralized notifications for:

- Success
- Error
- Warning
- Information

---

## Dates

If required:

```
npm install date-fns

```

Use for appointment/date formatting.

---

## Charts

Only if dashboard charts are genuinely required:

```
npm install recharts

```

Lazy-load chart components.

---

# 5. OPTIONAL TEST PACKAGES

If testing dependencies do not already exist:

```
npm install -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event jsdom

```

Focus testing on:

- Authentication
- Protected routes
- Role routes
- Appointment booking
- Forms
- API error handling
- Important admin actions

---

# 6. GLOBAL CSS ARCHITECTURE — VERY IMPORTANT

All important colors, dimensions, shadows, radii and other global design values must be centralized.

Create:

```
src/styles/
│
├── variables.css
├── global.css
├── animations.css
├── utilities.css
└── responsive.css

```

---

# 7. CENTRAL COLOR FILE

Create:

```
src/styles/variables.css

```

This is the MAIN design-token file.

Example:

```
:root {
  /* Brand */
  --color-primary: #49C0F2;
  --color-primary-light: #DDF5FE;
  --color-primary-soft: #F0FAFE;
  --color-primary-dark: #229FD2;

  /* Base */
  --color-white: #FFFFFF;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;

  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;

  /* Border */
  --color-border: #E2E8F0;

  /* States */
  --color-success: #16A34A;
  --color-warning: #F59E0B;
  --color-error: #DC2626;
  --color-info: #0284C7;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-round: 999px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 20px 50px rgba(15, 23, 42, 0.12);

  /* Layout */
  --container-max-width: 1280px;

  /* Animation */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;

  /* Header */
  --header-height: 76px;
}

```

IMPORTANT:

Never repeatedly hardcode:

```
#49C0F2

```

through dozens of CSS files.

Instead use:

```
color: var(--color-primary);

```

If the hospital brand color changes later, we should be able to change it primarily from:

```
variables.css

```

---

# 8. GLOBAL CSS

Create:

```
src/styles/global.css

```

Use it for:

- Reset
- `box-sizing`
- Body
- Typography
- Containers
- Global links
- Basic button normalization
- Images
- Common headings
- Scroll behavior

Example structure:

```
@import "./variables.css";
@import "./animations.css";
@import "./utilities.css";
@import "./responsive.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--color-text-primary);
  background: var(--color-background);
}

```

Import global CSS ONCE from the application entry point.

---

# 9. COMPONENT/PAGE CSS

Use normal `.css` files.

Example:

```
Header.jsx
Header.css

HeroSection.jsx
HeroSection.css

DoctorCard.jsx
DoctorCard.css

Login.jsx
Login.css

```

Component styles should use the variables defined in:

```
variables.css

```

Do not duplicate color constants.

Use meaningful scoped class names to reduce style collisions.

Example:

```
.doctor-card {}
.doctor-card__image {}
.doctor-card__title {}
.doctor-card__specialization {}
.doctor-card__actions {}

```

Avoid generic global classes such as:

```
.card {}
.title {}
.box {}

```

when they can unintentionally affect unrelated components.

---

# 10. PROJECT PURPOSE

The frontend consists of:

```
Public Hospital Website
+
Authentication System
+
Patient Portal
+
Doctor Portal
+
Admin Portal

```

It should feel like a polished healthcare platform rather than a simple CRUD interface.

---

# 11. BRAND

Primary:

```
#49C0F2

```

Secondary:

```
#FFFFFF

```

Visual direction:

- Modern
- Clean
- Medical
- Trustworthy
- Premium
- Professional
- Friendly
- Accessible
- Spacious

Use significant white space.

Do not make every section blue.

---

# 12. EXISTING BACKEND ROLES

There are currently ONLY three roles:

```
patient
doctor
admin

```

Do NOT create additional functional roles.

---

# 13. EXISTING BACKEND FEATURES

## Authentication

Supports:

```
Patient registration
Login
JWT authentication
Role-based authorization
Change password

```

## Users

Supports:

```
Get own profile
Update own profile

Admin user list
Admin user details
Activate user
Deactivate user
Admin password reset where supported

```

## Doctors

Supports:

```
Doctor list
Doctor search
Doctor filter
Doctor details
Admin create doctor
Admin edit doctor
Doctor professional profile
Doctor availability
Working hours
Appointment duration
Consultation fee
Specialization
Department
Qualifications
Languages
Biography
Experience

```

## Appointments

### Patient

```
Book appointment
View appointments
View appointment details
Cancel appointment

```

### Doctor

```
View assigned appointments
View appointment
Confirm
Reject
Cancel
Complete

```

### Admin

```
View appointments
Filter appointments
View appointment
Change status

```

---

# 14. BACKEND FEATURES THAT DO NOT EXIST

Currently there is no backend for:

```
Pharmacy
Medicine inventory
Prescriptions

Laboratory
Lab requests
Lab results

Billing
Payments
Invoices

Ward management
Beds
Admissions
Discharges

Medical records
Diagnosis
Treatment history

Nurse management

Forgot password email flow

Contact submissions

Testimonials CMS

Public website CMS

Header CMS
Footer CMS

```

Never create fake APIs for these features.

Public website content around these subjects may be STATIC only.

---

# 15. PAGE TYPES

Every page must be classified as:

```
STATIC
DYNAMIC
MIXED

```

### STATIC

No backend required.

### DYNAMIC

Uses an existing backend API.

### MIXED

Contains static design/content and backend-powered sections.

---

# 16. COMPLETE PAGE LIST

## PUBLIC

| PageRouteType  |                |         |
| -------------- | -------------- | ------- |
| Home           | `/`            | MIXED   |
| About          | `/about`       | STATIC  |
| Services       | `/services`    | STATIC  |
| Departments    | `/departments` | STATIC  |
| Doctors        | `/doctors`     | DYNAMIC |
| Doctor Details | `/doctors/:id` | DYNAMIC |
| Contact        | `/contact`     | STATIC  |
| FAQ            | `/faq`         | STATIC  |
| Privacy        | `/privacy`     | STATIC  |
| Terms          | `/terms`       | STATIC  |

## AUTHENTICATION

| PageRouteType |             |         |
| ------------- | ----------- | ------- |
| Login         | `/login`    | DYNAMIC |
| Register      | `/register` | DYNAMIC |

## PATIENT

| PageRoute           |                                        |
| ------------------- | -------------------------------------- |
| Dashboard           | `/patient/dashboard`                   |
| Find Doctors        | `/patient/doctors`                     |
| Doctor Details      | `/patient/doctors/:id`                 |
| Book Appointment    | `/patient/appointments/book/:doctorId` |
| My Appointments     | `/patient/appointments`                |
| Appointment Details | `/patient/appointments/:id`            |
| Profile             | `/patient/profile`                     |
| Change Password     | `/patient/change-password`             |

## DOCTOR

| PageRoute            |                            |
| -------------------- | -------------------------- |
| Dashboard            | `/doctor/dashboard`        |
| Appointments         | `/doctor/appointments`     |
| Appointment Details  | `/doctor/appointments/:id` |
| Professional Profile | `/doctor/profile`          |
| Availability         | `/doctor/availability`     |
| Account              | `/doctor/account`          |
| Change Password      | `/doctor/change-password`  |

## ADMIN

| PageRoute           |                           |
| ------------------- | ------------------------- |
| Dashboard           | `/admin/dashboard`        |
| Users               | `/admin/users`            |
| User Details        | `/admin/users/:id`        |
| Doctors             | `/admin/doctors`          |
| Add Doctor          | `/admin/doctors/new`      |
| Doctor Details      | `/admin/doctors/:id`      |
| Edit Doctor         | `/admin/doctors/:id/edit` |
| Appointments        | `/admin/appointments`     |
| Appointment Details | `/admin/appointments/:id` |
| Profile             | `/admin/profile`          |
| Change Password     | `/admin/change-password`  |

## SYSTEM

```
/403
*

```

Create professional Unauthorized and 404 pages.

---

# 17. REQUIRED FOLDER STRUCTURE

Use approximately this structure:

```
src/
│
├── api/
│   ├── axiosInstance.js
│   └── endpoints.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── illustrations/
│
├── components/
│   │
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── Input.jsx
│   │   ├── Input.css
│   │   ├── Select.jsx
│   │   ├── Textarea.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── Badge.jsx
│   │   ├── Spinner.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchInput.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   └── PageLoader.jsx
│   │
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── MobileMenu.jsx
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── PublicLayout.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── DashboardLayout.css
│   │   ├── Sidebar.jsx
│   │   ├── MobileSidebar.jsx
│   │   └── DashboardTopbar.jsx
│   │
│   ├── skeletons/
│   │   ├── DoctorCardSkeleton.jsx
│   │   ├── DashboardSkeleton.jsx
│   │   ├── TableSkeleton.jsx
│   │   ├── ProfileSkeleton.jsx
│   │   └── AppointmentSkeleton.jsx
│   │
│   ├── doctors/
│   │   ├── DoctorCard.jsx
│   │   ├── DoctorCard.css
│   │   ├── DoctorFilters.jsx
│   │   └── DoctorAvailability.jsx
│   │
│   ├── appointments/
│   │   ├── AppointmentCard.jsx
│   │   ├── AppointmentTable.jsx
│   │   ├── AppointmentFilters.jsx
│   │   └── AppointmentStatusBadge.jsx
│   │
│   └── dashboard/
│       ├── StatCard.jsx
│       ├── QuickAction.jsx
│       └── DashboardChart.jsx
│
├── config/
│   ├── pageRegistry.js
│   ├── navigation.js
│   ├── constants.js
│   └── queryClient.js
│
├── context/
│   └── AuthContext.jsx
│
├── data/
│   ├── services.js
│   ├── departments.js
│   ├── testimonials.js
│   └── faq.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useDebounce.js
│   ├── useMediaQuery.js
│   ├── useScrollTop.js
│   └── useDocumentTitle.js
│
├── mappers/
│   ├── authMapper.js
│   ├── userMapper.js
│   ├── doctorMapper.js
│   └── appointmentMapper.js
│
├── pages/
│   ├── public/
│   ├── auth/
│   ├── patient/
│   ├── doctor/
│   ├── admin/
│   └── system/
│
├── providers/
│   └── AppProviders.jsx
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
│
├── schemas/
│   ├── loginSchema.js
│   ├── registrationSchema.js
│   ├── appointmentSchema.js
│   ├── profileSchema.js
│   ├── passwordSchema.js
│   └── doctorSchema.js
│
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── doctorService.js
│   ├── appointmentService.js
│   └── adminService.js
│
├── styles/
│   ├── variables.css
│   ├── global.css
│   ├── animations.css
│   ├── utilities.css
│   └── responsive.css
│
├── utils/
│   ├── errorHandler.js
│   ├── formatDate.js
│   ├── storage.js
│   ├── permissions.js
│   └── validators.js
│
├── App.jsx
└── main.jsx

```

Do not create unnecessary duplicated layout structures.

---

# 18. CENTRAL PAGE REGISTRY

Create:

```
src/config/pageRegistry.js

```

Every page should contain information such as:

```
{
  id: "patient-appointments",
  title: "My Appointments",
  path: "/patient/appointments",
  role: "patient",
  type: "dynamic",
  showInNavigation: true
}

```

Fields:

```
id
title
path
role
type
showInNavigation

```

---

# 19. CENTRAL NAVIGATION

Create:

```
src/config/navigation.js

```

Do not hardcode sidebar menu items independently in multiple files.

---

# 20. ENVIRONMENT VARIABLES

Create:

```
.env
.env.example

```

Example:

```
VITE_API_BASE_URL=http://localhost:YOUR_BACKEND_PORT/api/v1

```

`.env.example`:

```
VITE_API_BASE_URL=

```

Never hardcode the base API URL throughout page components.

---

# 21. CENTRAL AXIOS INSTANCE

Create:

```
src/api/axiosInstance.js

```

Concept:

```
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

```

Every HTTP request must pass through this API instance.

---

# 22. API ENDPOINT CONSTANTS

Create:

```
src/api/endpoints.js

```

Use actual existing backend endpoints.

Do not invent endpoints.

Example architecture:

```
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  USERS: {
    ME: "/users/me",
    CHANGE_PASSWORD: "/users/change-password",
  },

  DOCTORS: {
    LIST: "/doctors",
    ME: "/doctors/me",
  },

  APPOINTMENTS: {
    MY: "/appointments/my",
  },
};

```

Verify every path against the backend first.

---

# 23. API SERVICE LAYER

Components/pages should NOT communicate with Axios directly.

Example:

```
Doctors.jsx
        ↓
doctorService.js
        ↓
axiosInstance.js
        ↓
Backend

```

The returned backend response may then pass through:

```
doctorMapper.js

```

before reaching the UI.

---

# 24. AUTHENTICATION

Create:

```
AuthContext
useAuth
ProtectedRoute
RoleRoute

```

After login:

```
patient → /patient/dashboard
doctor  → /doctor/dashboard
admin   → /admin/dashboard

```

Public registration is PATIENT ONLY.

Never create a public doctor/admin role selector.

---

# 25. API ERRORS

Axios interceptor should handle:

```
400
401
403
404
409
422 where applicable
500
Network error
Timeout

```

Do not display raw backend error objects.

Use:

```
src/utils/errorHandler.js

```

to generate friendly messages.

---

# 26. HOMEPAGE — HIGHEST DESIGN PRIORITY

The homepage should be the most visually impressive page.

Recommended structure:

```
Header

Hero

Trust Statistics

About Preview

Services

Departments

Featured Doctors

Why Choose Us

How Appointment Booking Works

Testimonials

FAQ Preview

Final CTA

Footer

```

---

# 27. HERO

Create a visually premium healthcare hero.

Possible headline:

```
Compassionate Care.
Advanced Medicine.
Better Health.

```

CTA:

```
Book Appointment
Find a Doctor

```

Possible visuals:

- Large doctor image
- Soft medical gradient
- Floating appointment card
- Availability card
- Healthcare icons
- Trust badges
- Statistics
- Decorative medical shapes
- Controlled glassmorphism

Primary visual color:

```
#49C0F2

```

Use through CSS variables.

---

# 28. ANIMATION

Use Motion.

Animation examples:

```
Fade up
Slide
Stagger
Image reveal
Counter animation
Floating card
CTA hover
Mobile navigation
Section reveal
Gentle parallax

```

Animations must remain subtle and performant.

Prefer:

```
transform
opacity

```

Respect:

```
prefers-reduced-motion

```

---

# 29. FEATURED DOCTORS

Use the actual backend.

During loading:

```
DoctorCardSkeleton

```

On error:

```
Error message
Retry button

```

No blank areas.

---

# 30. HEADER

Static reusable component.

Features:

```
Sticky
Responsive
Backdrop blur
Active navigation
Animated CTA
Hamburger
Mobile drawer
Body scroll lock
Keyboard accessibility

```

No backend required.

---

# 31. FOOTER

Static reusable component.

Include:

```
Hospital identity
Description
Links
Services
Departments
Address
Phone
Email
Opening hours
Social links
Privacy
Terms
Copyright

```

No backend required.

---

# 32. PATIENT DASHBOARD

Show:

```
Welcome message
Upcoming appointment
Appointment statistics
Recent appointments
Find Doctor shortcut
Book Appointment shortcut

```

Use backend data where supported.

---

# 33. DOCTOR DASHBOARD

Show:

```
Today's appointments
Pending
Confirmed
Completed
Upcoming schedule
Availability shortcut
Quick actions

```

---

# 34. ADMIN DASHBOARD

Show:

```
Total patients/users
Total doctors
Total appointments
Pending appointments
Confirmed appointments
Completed appointments
Recent appointments
Recent users
Quick actions

```

Only show statistics that can reasonably be obtained from existing backend APIs.

Do not invent analytics APIs.

---

# 35. SKELETON LOADING

Create:

```
DoctorCardSkeleton
DashboardSkeleton
TableSkeleton
ProfileSkeleton
AppointmentSkeleton
PageSkeleton

```

Skeletons should closely match the final content dimensions.

---

# 36. LAZY LOADING

Use:

```
React.lazy()
Suspense

```

Primarily for:

```
Pages
Role modules
Charts
Heavy sections

```

Do not lazy-load every tiny component.

---

# 37. RESPONSIVE DESIGN

Test at approximately:

```
320px
375px
390px
430px
768px
1024px
1280px+

```

Mobile requirements:

```
Responsive header
Mobile navigation
Mobile dashboard drawer
Stacked cards
Single-column forms
Responsive appointment cards
Usable tables
No accidental horizontal overflow

```

---

# 38. FORMS

Use:

```
React Hook Form
+
Zod

```

Schemas belong in:

```
src/schemas/

```

Never put massive validation logic inside JSX pages.

---

# 39. TOASTS

Use Sonner centrally.

Examples:

```
Login successful.
Appointment booked successfully.
Profile updated successfully.
Doctor created successfully.

```

And:

```
Invalid email or password.
Unable to load doctors.
Appointment slot is unavailable.
Something went wrong.

```

---

# 40. PERFORMANCE

Optimize intelligently using:

```
React.memo
useMemo
useCallback
React.lazy
Suspense
TanStack Query
Debounce
Pagination
Image lazy loading
Dynamic imports

```

Do not memoize everything blindly.

Focus on:

```
LCP
CLS
INP

```

Avoid duplicate API calls.

---

# 41. ACCESSIBILITY

Support:

```
Semantic HTML
Form labels
Keyboard navigation
Visible focus
Accessible menu
Accessible modal
Alt text
Correct contrast
Reduced motion

```

---

# 42. STATIC CONTENT

Store static website data in:

```
src/data/

```

For example:

```
services.js
departments.js
testimonials.js
faq.js

```

Do not create huge static arrays directly inside JSX pages.

---

# 43. DEVELOPMENT ORDER

## PHASE 0

```
Inspect existing React + Vite project
Inspect package.json
Inspect existing dependencies
Install only missing dependencies
Verify npm run dev

```

## PHASE 1

```
Create folder structure

Create:
variables.css
global.css
animations.css

Configure API
Configure Query Client
Configure providers
Configure routing
Configure navigation
Configure page registry

```

## PHASE 2

```
Header
Footer
Home
About
Services
Departments
Doctors
Doctor Details
Contact
FAQ
Privacy
Terms
403
404

```

## PHASE 3

```
Login
Register
AuthContext
ProtectedRoute
RoleRoute
Logout

```

## PHASE 4

```
Dashboard architecture
Sidebar
Mobile sidebar
Topbar
Stat cards
Tables
Skeletons

```

## PHASE 5

```
Patient pages

```

## PHASE 6

```
Doctor pages

```

## PHASE 7

```
Admin pages

```

## PHASE 8

```
Responsive fixes
Animations
Accessibility
Performance
Testing
Build verification

```

---

# 44. MANDATORY BACKEND RESPONSE / FRONTEND VARIABLE MAPPING

This is a VERY IMPORTANT requirement.

Before implementing any DYNAMIC page, inspect the actual backend:

```
Controller
DTO
Entity/Schema
Service
Route
Request body
Response body
Pagination structure
Nested populated data
Enums/status values

```

Do NOT guess API field names from frontend designs.

The frontend field names and backend response field names may be different.

Possible examples include:

```
Frontend       Backend may use

id             _id
name           fullName
phone          phoneNumber
date           appointmentDate
time           appointmentTime
fee            consultationFee
image          profileImage

```

These are only examples.

The actual backend response is the source of truth.

---

# 45. CREATE A RESPONSE NORMALIZATION / MAPPER LAYER

Do NOT solve naming mismatches repeatedly inside individual JSX pages.

Create:

```
src/mappers/
│
├── authMapper.js
├── userMapper.js
├── doctorMapper.js
└── appointmentMapper.js

```

Example concept:

```
export const mapDoctor = (doctor) => ({
  id: doctor._id ?? doctor.id,
  name: doctor.fullName ?? doctor.name,
  specialization: doctor.specialization,
  department: doctor.department,
  consultationFee: doctor.consultationFee,
  profileImage: doctor.profileImage,
});

```

ONLY implement mappings that are actually required after inspecting backend responses.

Do not invent unnecessary aliases.

---

# 46. MAP OUTGOING PAYLOADS TOO

Variable mismatching can happen in BOTH directions.

Example:

Frontend form might use:

```
{
  date,
  time,
  reason
}

```

while backend may expect another structure.

Therefore mapper/service functions may also normalize frontend form data into the exact backend request body.

Example architecture:

```
React Form
   ↓
Frontend form values
   ↓
mapAppointmentPayload()
   ↓
appointmentService.js
   ↓
Backend

```

Again:

> Always inspect the backend DTO before determining the payload.

---

# 47. PAGES THAT MUST VERIFY BACKEND RESPONSE FIELD NAMES

The following pages/features MUST verify actual API response variables before final implementation:

## Authentication

```
Login
Registration
AuthContext
Role redirect

```

Especially verify:

```
token field
user object
role field
user id
success/error response format

```

---

## Doctors

```
Public Doctors
Doctor Details
Patient Find Doctors
Patient Doctor Details
Admin Doctors
Admin Doctor Details
Admin Edit Doctor
Doctor Professional Profile
Doctor Availability

```

Verify:

```
doctor ID
doctor user/name structure
specialization
department
qualifications
experience
fee
availability
working hours
languages
profile image
pagination

```

---

## Patient Appointments

```
Patient Dashboard
My Appointments
Appointment Details
Book Appointment

```

Verify especially whether doctor/patient information is:

```
direct fields

OR

nested objects

OR

referenced IDs

```

Never assume:

```
appointment.doctor.name

```

exists.

Inspect the response first.

---

## Doctor Appointments

```
Doctor Dashboard
Doctor Appointments
Doctor Appointment Details

```

Verify:

```
patient structure
patient name
patient phone
appointment ID
appointment date/time
status
reason

```

---

## Profiles

```
Patient Profile
Doctor Account
Admin Profile

```

Verify exact backend fields for:

```
full name
email
phone
address
city
gender
date of birth
emergency contact
role
account status

```

---

## Admin Users

```
Admin Users
User Details
Activate/Deactivate
Reset Password

```

Verify:

```
id
full name
role
isActive
pagination
response messages

```

---

## Admin Appointments

```
Admin Dashboard
Admin Appointments
Admin Appointment Details

```

Verify:

```
doctor nested structure
patient nested structure
date
time
duration
status
reason
cancellation reason
pagination

```

---

# 48. IMPORTANT API RESPONSE RULE

If a dynamic page does not display the expected data:

DO NOT immediately change the JSX variable name by guessing.

Instead:

1. Inspect Network tab response
2. Inspect backend controller/service
3. Identify actual response structure
4. Update mapper/service
5. Keep page/component data structure consistent

The UI should consume a predictable normalized model.

Example:

```
BACKEND RESPONSE
      ↓
SERVICE
      ↓
MAPPER
      ↓
NORMALIZED FRONTEND MODEL
      ↓
REACT COMPONENT

```

This prevents variable/name mismatch problems across the whole project.

---

# 49. API CONTRACT DOCUMENTATION

Create:

```
src/api/API_CONTRACT.md

```

or maintain an equivalent section in the frontend README.

For each backend-connected module document:

```
Endpoint
Method
Access role
Request payload
Expected response
Important fields
Pagination format
Known nested objects
Frontend mapper

```

Example:

```
Doctors

GET /doctors

Access:
Public

Used By:
Home Featured Doctors
Doctors Page
Patient Find Doctors

Mapper:
doctorMapper.js

```

This will make future integration and debugging significantly easier.

---

# 50. DO NOT HIDE BACKEND MISMATCHES WITH MOCK DATA

When a real API exists:

Do not replace failed integration with fake data just to make the page appear complete.

If the response shape does not match:

```
Inspect
Map
Fix

```

Do not fake it.

---

# 51. FINAL VERIFICATION

Before declaring the frontend complete:

Run:

```
npm run build

```

Check:

```
No build errors
No console errors
No broken imports
No fake endpoints
No unresolved routes
No unauthorized route access
No duplicate API requests
No incorrect response field assumptions
No variable/name mismatch errors
No broken mobile layouts
No horizontal overflow
No inaccessible forms/buttons

```

Also test real API responses for:

```
Login
Registration
Doctors
Doctor Details
Appointments
Profiles
Admin Users
Admin Doctors
Admin Appointments

```

---

# 52. FINAL EXPECTATION

The application should provide:

```
Modern Hospital Public Website
+
Patient Portal
+
Doctor Portal
+
Admin Portal

```

using:

```
React
Vite
Plain CSS
CSS Variables
Axios
TanStack Query
React Hook Form
Zod
Motion
Lucide React
Sonner

```

The highest priorities are:

```
Excellent homepage
Attractive healthcare hero
#49C0F2 + white branding
Centralized global CSS colors
Plain CSS only
Responsive design
Smooth animations
Role-based authentication
Central Axios configuration
Correct API mapping
Backend/frontend variable compatibility
Skeleton loading
Lazy loading
Clear errors
Success notifications
Reusable components
Strong folder architecture
Performance optimization
Accessibility
Accurate backend integration

```

The React + Vite project is ALREADY INITIALIZED.

There are currently NO application pages.

DO NOT create another project.

Start by:

```
1. Inspecting the existing project
2. Inspecting package.json
3. Installing only missing packages
4. Creating the required folder architecture
5. Creating centralized CSS variables
6. Creating centralized API architecture
7. Inspecting backend response structures
8. Creating response mappers where necessary
9. Creating public pages
10. Creating authentication
11. Creating Patient, Doctor and Admin portals
12. Testing real frontend/backend integration

```

Always treat the backend DTOs and actual API responses as the source of truth for dynamic field names.