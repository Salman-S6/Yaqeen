# Yaqeen Frontend

## Project Name

**Yaqeen / يقين – Frontend**

## Project Description

Yaqeen is the frontend interface for a digital government-services platform. The frontend provides authenticated dashboards for administrators and employees, request review screens, OCR monitoring, QR verification logs, audit logs, service management, and user profile pages.

This repository contains the **Frontend only**. It communicates with backend API endpoints through Axios services defined inside `src/api`.

## Main Features

- Employee/Admin login page.
- Role-based protected routes for Admin and Employee areas.
- Central layout with sidebar and header.
- Admin user and citizen management interface.
- Admin request history and request review mode.
- Admin audit logs page.
- Admin statistics dashboard with charts.
- Employee performance dashboard.
- OCR monitoring page with loading, error, empty-data, and retry states.
- External QR verification log page.
- Government service type management page.
- Employee dashboard and pending-request review workflow.
- User profile page.
- Toast notifications for user feedback.

## Technologies Used

- React
- Vite
- Axios
- React Router
- CSS Modules
- Recharts
- React Icons
- ESLint

## Folder Structure

```txt
src/
├── api/
│   ├── authService.js
│   ├── axios.js
│   ├── employeeRequestService.js
│   ├── employeeService.js
│   └── serviceTypeService.js
│
├── components/
│   ├── Button/
│   ├── Charts/
│   ├── Common/
│   ├── ConfirmModal/
│   ├── Header/
│   ├── InputField/
│   ├── Modals/
│   ├── ProtectedRoute/
│   ├── Sidebar/
│   └── ...
│
├── hooks/
│   └── useOCRMonitoring.js
│
├── layouts/
│   └── MainLayout.jsx
│
├── pages/
│   ├── AdminAuditPage/
│   ├── AdminOCRPage/
│   ├── AdminPerfPage/
│   ├── AdminRequestsPage/
│   ├── AdminServicesPage/
│   ├── AdminStatsPage/
│   ├── AdminUsersPage/
│   ├── EmployeeDashboard/
│   ├── ExternalVerifyPage/
│   ├── Login/
│   ├── PendingRequests/
│   ├── RequestReview/
│   └── UserProfilePage/
│
├── utils/
│   ├── apiResponse.js
│   └── auth.js
│
├── App.jsx
├── index.css
└── main.jsx
```

## Installation

Install dependencies:

```bash
npm install
```

or, for a clean install based on `package-lock.json`:

```bash
npm ci
```

## Environment Variables

Create a `.env` file in the project root. The project expects the following variable:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For public tunneling during testing, the same variable can point to an ngrok API URL:

```env
VITE_API_BASE_URL=https://your-ngrok-url/api
```

## Available Scripts

```bash
npm run dev
```

Runs the Vite development server.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run preview
```

Previews the production build locally after running `npm run build`.

## How to Run Development Server

```bash
npm run dev
```

Then open the local URL displayed by Vite in the terminal.

## How to Build for Production

```bash
npm run build
```

The production output is generated inside the `dist/` directory. The `dist/` directory is not required when submitting the source code unless the instructor specifically asks for a compiled build.

## API Configuration

Axios is configured in:

```txt
src/api/axios.js
```

The Axios instance uses `VITE_API_BASE_URL` as the base URL. It also sends JSON headers and automatically attaches the authentication token when available:

```txt
Authorization: Bearer <token>
```

The main API service files are:

```txt
src/api/authService.js
src/api/employeeRequestService.js
src/api/employeeService.js
src/api/serviceTypeService.js
```

## Authentication Flow

1. The user logs in from the Login page.
2. The frontend calls `auth/login` through `authService.login`.
3. On successful login, the token and user object are saved in `localStorage`.
4. Protected pages call `auth/me` through `ProtectedRoute` to verify the real authenticated user and role from the backend.
5. Axios sends the token automatically with protected API requests.
6. If the backend returns `401` or `419`, local session data is cleared and the user is redirected to `/login`.
7. Logout clears the local session data.

## Roles and Permissions

The frontend currently handles two main roles:

- `admin`
- `employee`

Admin routes are protected through `ProtectedRoute` and are not based only on the `userRole` value stored in `localStorage`. The route guard verifies the authenticated user by calling `auth/me` before allowing access.

Main protected route groups:

```txt
/admin/*     -> admin only
/employee/*  -> employee only
```

Important security note: frontend route protection improves user experience, but the backend must also enforce permissions on every protected endpoint.

## Main Pages

### Public

- `/login` – employee/admin login page.

### Employee Pages

- `/employee/dashboard` – employee dashboard.
- `/employee/pending-requests` – pending requests.
- `/employee/review-request/:requestId` – request review and approve/reject workflow.
- `/employee/profile` – user profile.

### Admin Pages

- `/admin/users` – users/citizens management.
- `/admin/all-requests` – full request history.
- `/admin/review-request/:requestId` – admin request review view.
- `/admin/stats` – system statistics.
- `/admin/performance` – employee performance.
- `/admin/ocr` – OCR monitoring.
- `/admin/verify-qr` – QR verification logs.
- `/admin/services` – service type management.
- `/admin/audit-logs` – audit logs.
- `/admin/profile` – user profile.

## Error Handling

The frontend includes the following error-handling behavior:

- Axios response interceptor handles `401` and `419` by clearing session data and redirecting to login.
- API pages include loading states.
- Main admin and employee pages show user-facing error messages when API calls fail.
- Retry buttons are available on key pages such as OCR monitoring, statistics, performance, requests, audit logs, and verification logs.
- Shared helper functions in `src/utils/apiResponse.js` normalize common API response shapes and extract readable error messages.

## Notes for Deployment

- Set `VITE_API_BASE_URL` to the deployed backend API URL before building.
- Run `npm run build` before deployment.
- Deploy the generated `dist/` folder to a static hosting service.
- Configure the hosting server to redirect unknown frontend routes to `index.html`, because the project uses React Router.
- Do not deploy `.env` files containing private data.
- Keep backend authorization enabled; do not rely only on frontend route guards.

## Notes for Academic Submission

- Submit the source code without `node_modules/`.
- Submit the source code without `dist/` unless a production build is explicitly required.
- Include `.env.example` to show required environment variables.
- Run the following commands before final submission:

```bash
npm run lint
npm run build
```

Current verification result after fixes:

```txt
npm run lint  -> passed
npm run build -> passed
```

Build note: Vite may show a chunk-size warning because the final JavaScript bundle is larger than 500 KB. This is a performance optimization warning, not a build failure.
