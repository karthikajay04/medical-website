# Aethera Clinic Management Suite

Aethera is a premium, high-fidelity, real-time healthcare clinic management system. It provides patients with an elegant online appointment scheduler, gives physicians a digital vitals and prescription desk, displays a live token waitlist board in waiting rooms, and equips administrative staff with a pixel-perfect, dynamic Rx prescription printing studio.

The application is engineered with a modern, glassmorphic design language featuring deep clinical teals (`#0B2C24`), premium gold accents (`#C8A96B`), and fluid typography utilizing Google Fonts (Instrument Serif and Outfit/Inter).

---

## 🗺️ System Architecture

The suite operates on a multi-role pipeline synchronized instantly via **Server-Sent Events (SSE)** telemetry. When a patient schedules a visit or a physician completes a consultation, waiting-room monitors, front-desks, and booking queues reflect the status change instantly.

```mermaid
graph TD
    %% Roles & Ports
    P[Patient / Guest] -->|Book Appointment| B[Schedule Scheduler]
    B -->|PostgreSQL Record| DB[(aethera DB)]
    
    DB -->|Fetch Roster| DR[Doctor Workspace]
    DR -->|Log Vitals & Rx| DB
    DR -->|SSE Queue Broadcast| SSE[SSE Telemetry Hub]
    
    SSE -->|Real-time Token Sync| LQ[Live Waitlist Board]
    SSE -->|Roster Sync| AD[Admin Reception Dashboard]
    
    AD -->|Auto-populates Rx| PS[Rx Slip Printing Studio]
```

---

## 💎 Key Capabilities & Workflows

### 1. Patient Portal & Booking
* **Visual Calendar Scheduling:** Browse visiting times of medical specialists (General Physicians, Pediatricians, Orthopedics, Gynecologists, and Dermatologists).
* **Smart Token System:** Appointments are systematically assigned consecutive token numbers for each doctor and date.
* **Estimated Wait-Time Engine:** Calculates and displays estimated check-in times to minimize crowded lobbies.

### 2. Live Waiting-Room Display
* **Dynamic Wait Board:** Shows currently serving token numbers, total booked counts, and active patient listings.
* **Flashing Status Cards:** Visually highlights active patient tokens to alert visitors waiting in the lobby.

### 3. Doctor's Clinical Desk
* **Queue Roster Sidebar:** Doctors can view their active queues and review histories.
* **Case Sheet:** Access patient specifics, reason for visit, and booking reference codes.
* **Vitals Terminal:** Input key telemetry: Blood Pressure (mmHg), Temperature (°F), Pulse Rate (bpm), and SpO2 (%).
* **Custom Rx Formulator:** Interactive row builder to configure medication names, strengths, intake schedules, and lengths.
* **Instant Wait-Time Sync:** Saving updates transitions the booking status to `Completed` and broadcasts SSE telemetry to receptionist screens.

### 4. Admin Reception & Rx Studio
* **Clinic Customizer:** Update clinic name, address, phone number, and announcements.
* **Split-pane Rx Studio:**
  * **Interactive Builder (Left):** Real-time editor to update patient age, name, and modify medications.
  * **Aesthetic Preview (Right):** Visualizes the printed layout containing serif-styled clinic letters, patient particulars, vitals, doctor notes, and dynamic signature blocks.
  * **Native Print Driver:** Triggers high-fidelity CSS media query printing.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite | Ultra-fast SPA scaffolding with HMR. |
| **Styling** | Tailwind CSS | Sleek custom panels and layouts. |
| **Database ORM** | Prisma | Schema definitions and migrations. |
| **Backend Core** | Node.js, Express, TypeScript | RESTful routes with TSX watch engines. |
| **Database** | PostgreSQL | Relational transactional database. |
| **Real-time Sync** | Server-Sent Events (SSE) | Unidirectional event telemetry. |
| **Validation** | Zod | Robust frontend & backend request validation. |

---

## 📂 Project Directory Structure

```text
├── server/                    # Node.js Express Backend
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma database schemas
│   │   └── seed.ts            # Database seed script
│   ├── src/
│   │   ├── lib/
│   │   │   ├── prisma.ts      # Instantiated Prisma Client
│   │   │   └── sse.ts         # SSE queue broadcast manager
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT and Admin privilege checks
│   │   ├── routes/
│   │   │   ├── auth.ts        # Signup / Login / Me endpoints
│   │   │   ├── bookings.ts    # Clinical consultations & printing routes
│   │   │   ├── doctors.ts     # Specialist directories
│   │   │   ├── queue.ts       # SSE event client registrations
│   │   │   └── settings.ts    # Clinic configurations
│   │   └── index.ts           # App entrypoint
│   ├── package.json
│   └── tsconfig.json
│
└── src/                       # React TypeScript Frontend
    ├── assets/                # Media files and global CSS
    ├── components/
    │   ├── ui/                # UI controls (cards, banners)
    │   └── Navbar.tsx         # Unified navigation header
    ├── lib/
    │   └── api.ts             # Axios HTTP client configuration
    ├── pages/
    │   ├── admin/
    │   │   ├── AdminLayout.tsx # Administrative sidebar & security check
    │   │   ├── Bookings.tsx   # Prescription Print Modal & appointment roster
    │   │   ├── Dashboard.tsx  # Analytics charts and serving tokens
    │   │   ├── Doctors.tsx    # Specialist rosters
    │   │   ├── Availability.tsx # Calendar schedules
    │   │   └── Settings.tsx   # Clinic name & announcement controls
    │   ├── doctor/
    │   │   ├── DoctorLayout.tsx # Physician dashboard frame & security check
    │   │   └── Dashboard.tsx  # Interactive vitals, diagnosis, and Rx writer
    │   ├── About.tsx          # Specialist profiles & WhatsApp CTAs
    │   ├── Booking.tsx        # Multi-step scheduler
    │   ├── Contact.tsx        # Dynamic support page
    │   ├── Home.tsx           # Fullscreen cinematic hero landing
    │   ├── LiveQueue.tsx      # Lobby waiting-room board
    │   ├── Login.tsx          # Split-screen auth form
    │   └── Signup.tsx         # Patient sign-up page
    ├── App.tsx                # Page router
    └── main.tsx               # SPA entry point
```

---

## 🚀 Setup & Installation

### Prerequisites
* **Node.js:** v16.x or newer
* **PostgreSQL Database:** Running locally or hosted on an external server

### 1. Database & Environment Configuration
1. Create a local PostgreSQL database named `aethera`.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Create a `.env` file in the `server` root:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:yourpassword@127.0.0.1:5432/aethera?schema=public"
   JWT_SECRET="aethera_super_secret_jwt_token_key_2026"
   ```

### 2. Backend Initialization & Database Seeding
Navigate to the `server` folder, install backend packages, push the database schema, and seed the database with initial clinical data:
```bash
# Install server packages
npm install

# Push database schema & generate Prisma Client
npx prisma db push

# Seed database with initial clinics, doctors, and active bookings
npm run prisma:seed

# Start Node.js Express server
npm run dev
```
The server will boot and run at `http://localhost:5000`.

### 3. Frontend Scaffolding & Launch
Open a new terminal window in the project root directory:
```bash
# Install frontend packages
npm install

# Start Vite React server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Seeded Accounts for Testing

Use these seeded accounts to test the clinic workspace:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@aethera.com` | `adminpassword` | Full receptionist dashboard, active token adjustments, and printed prescription slips. |
| **Physician Desk** | `doctor@aethera.com` | `doctorpassword` | Assigned to **Dr. Robert Chen** (General Physician). Access to vitals records, case notes, and Rx formulator. |
| **Patient Profile** | `patient@aethera.com` | `patientpassword` | Renders a personalized profile dashboard where users can check booked appointments. |

---

## 📖 API Documentation Reference

All endpoints are prefixed with `/api`. All protected endpoints require a Bearer token in the `Authorization` header (`Authorization: Bearer <JWT_TOKEN>`).

### 1. Authentication
* **`POST /auth/signup`**: Create a new account.
* **`POST /auth/login`**: Authenticate credentials and get JWT token + role.
* **`GET /auth/me`** *(Protected)*: Retrieve logged-in user profile details.

### 2. Bookings & Clinical Prescriptions
* **`GET /bookings`** *(Admin only)*: Fetch all appointment bookings.
* **`GET /bookings/my`** *(Protected)*: Fetch logged-in user's personal bookings.
* **`GET /bookings/doctor`** *(Doctor only)*: Retrieve bookings assigned to the logged-in doctor.
* **`POST /bookings`** *(Protected)*: Schedule a new appointment slot.
* **`PUT /bookings/:id/status`** *(Admin only)*: Manually toggle status (`Pending` | `Completed` | `Cancelled`).
* **`PUT /bookings/:id/prescription`** *(Doctor only)*: Commit clinical vitals, diagnosis notes, and medication JSON checklists to a patient's database record.
* **`POST /bookings/:id/cancel`** *(Protected)*: Allows a patient to cancel their own appointment slot.

### 3. Queue Telemetry
* **`GET /queue/sse`**: Initiates a Server-Sent Events stream connecting clients for real-time wait-list syncs.
* **`GET /queue/status`**: Fetch active serving token indexes and wait totals.

### 4. Clinic Settings
* **`GET /settings`**: Load system-wide clinic titles, addresses, and banner announcements.
* **`PUT /settings`** *(Admin only)*: Update clinic details.
