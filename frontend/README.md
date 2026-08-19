# Hospital Management Frontend

A React + Vite frontend for the uploaded Hospital Management backend. It includes the public hospital website, authentication, patient portal, doctor portal, and admin portal.

## Stack

- React + Vite
- React Router
- Axios with one centralized instance
- TanStack Query
- React Hook Form + Zod
- Motion
- Lucide React
- Sonner
- Plain CSS with centralized CSS variables

## Run

```bash
npm install
npm run dev
```

The included `.env` points to:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Change it if your backend uses a different host or port.

## Build

```bash
npm run build
npm run preview
```

## API integration

All HTTP requests pass through `src/api/axiosInstance.js`, endpoint paths live in `src/api/endpoints.js`, API calls live in `src/services/index.js`, and response normalization lives in `src/mappers/index.js`.

See `src/api/API_CONTRACT.md` for the backend-verified API contract and known backend limitations.

## Important backend limitations

- Public `/doctors` only returns active doctors, so the admin doctor listing cannot recover deactivated doctors with the current backend API.
- Some appointment detail endpoints return doctor/patient IDs rather than fully populated related records.
- Contact form, testimonials, pharmacy, lab, billing, ward, and medical-record website content is static because no matching backend APIs were supplied.
- Public registration creates patient accounts only.

## Project specification

The supplied original frontend brief is included as `PROJECT_SPECIFICATION.md` for reference.
