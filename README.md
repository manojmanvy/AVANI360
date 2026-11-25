# 🌾 AVANI360

> Tamil Nadu's Premier Land & Property Marketplace — Built for Buyers, Sellers & Builders.

AVANI360 is a full-stack real estate platform tailored specifically for Tamil Nadu, offering 99acres-inspired discovery, transparent pricing (₹/sq.ft, ₹/cent, ₹/acre), and direct admin-mediated buyer lead management.

---

## 🎨 Design & Experience
- **Color Palette:** Muted Sage Grey (`#6d8368`), Warm Cream Beige (`#faf6ef` / `#ded0b8`), Signature Emerald Leaf Green (`#1fa572`).
- **Mobile First:** Floating bottom navigation bar, slide-up sheet modals for property forms and enquiries.
- **Privacy:** Buyer inquiries go exclusively to platform administrators — seller phone numbers are protected from spam.

---

## ⚙️ Tech Stack
- **Frontend:** React 18, Vite 4, Tailwind CSS 3, Lucide React, Axios
- **Mobile:** Capacitor 8 (Android & iOS)
- **Backend:** FastAPI (Python), SQLAlchemy 2.0 (async), Alembic, Pydantic v2
- **Database:** PostgreSQL

---

## 🏢 Managed By
**GREENYAS CONSULTANCY SERVICES**
- **Website:** [www.Greenyasdigitalads.com](http://www.Greenyasdigitalads.com)
- **Email:** avani360.gcs@gmail.com
- **Address:** PI No 124/55, Periyamaniyaka Street, Chengalpattu, Tamil Nadu - 603002

---

## 📱 Mobile App (Android APK)
The Android APK is automatically built via GitHub Actions on every commit to `main`.
You can download the latest `.apk` from the [Releases](https://github.com/manojmanvy/AVANI360/releases) section or under **Actions > Artifacts**.

---

## 🚀 Deployment

### Backend (Render Web Service)
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT` (run from `backend/`)
- **Health check:** `/health`
- Alembic migrations run automatically on startup (`upgrade head`).

Required environment variables (see `backend/.env.example`):
- `ENVIRONMENT=production`
- `DATABASE_URL` — managed PostgreSQL connection string
- `JWT_SECRET` — long random value; startup fails if the default is used in production
- `CORS_ORIGINS` — comma-separated frontend origins; `*` is rejected in production
- `FIRST_ADMIN_EMAIL`, `FIRST_ADMIN_PASSWORD` — admin is created only if it does not exist
- `BREVO_API_KEY` (or SMTP variables) — required for password-reset OTP emails

Never copy `backend/.env` (local credentials) to the deployed service.

### Frontend (static site)
- **Root directory:** `frontend/`
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist/`
- **Environment:** `VITE_API_BASE_URL=https://<backend-host>/api/v1`

### Local development
- Backend: `cd backend && uvicorn main:app --reload`
- Frontend: `cd frontend && npm install && npm run dev`
- `frontend/.env.development` points to `http://localhost:8000/api/v1`

### Verification
- `npm run build` in `frontend/`
- `ruff check .` in `backend/` (from `requirements-dev.txt`)
- Confirm `/health` returns `{"status":"ok"}`; a first request after idle may return 503 while a free Render service wakes up.
