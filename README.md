# Antenatal Information System

A React (Vite) + Supabase implementation of an antenatal care system: patient
registration, clinical assessment, laboratory, medication, appointments,
reports and role-based user management, built around the user flow from
the project document.

## Stack

- **Vite + React 18** — standard `npm create vite` setup, plain JS (no TypeScript)
- **Tailwind CSS** — styling
- **React Router v6** — routing, including a protected `/app` area
- **Supabase** — auth (email/password), Postgres database, row-level security
- **lucide-react** — icons

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com), create a new project.
2. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
3. In the Supabase dashboard, open the **SQL Editor**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates:
   - `profiles` (staff accounts + role: administrator, doctor, nurse,
     lab_personnel, receptionist)
   - `patients`, `clinical_assessments`, `lab_results`, `medications`,
     `appointments`
   - Row-level security policies (any signed-in staff member can read/write;
     tighten per-role later if you need it)
   - A trigger that auto-creates a `profiles` row (default role
     `receptionist`) whenever someone signs up

## 2. Create staff accounts

Staff can now create their own accounts and pick their own role:

1. On the landing page, they click **Create an account**, fill in their name,
   choose their role (Nurse/Midwife, Doctor, Laboratory personnel or
   Receptionist), and set a password.
2. They're taken straight to their dashboard — no waiting on an
   administrator.

**Administrator** is the one role nobody can self-assign (by design). To get
your first administrator:

1. In Supabase: **Authentication → Users → Add user** (or have someone sign
   up normally through the app first).
2. Open **Table Editor → profiles**, find that user's row, and set `role` to
   `administrator`.
3. From then on, that administrator can change anyone's role from the
   **User management** screen in the app.

## 3. Configure the app

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from step 1.

## 4. Install and run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

**Testing on another device (phone, tablet, another computer):** the dev
server is already configured to listen on your network, not just
`localhost`. When you run `npm run dev`, Vite's terminal output will show
a second line like:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

Open that `Network` URL on any device connected to the **same Wi-Fi**, and
you'll get the live app. Two things to double check if it doesn't load:
- Your computer's firewall may need to allow incoming connections on port
  5173 the first time.
- Your phone/other device must be on the same network (not on cellular
  data, not a guest network that isolates devices).

- `/` — public landing page with the hero image carousel
- `/login` — staff sign-in
- `/app` — dashboard (protected; redirects to `/login` if not signed in)
  - `/app/patients` — register & search patients, view a full patient record
  - `/app/clinical` — record vitals/assessment for a visit
  - `/app/laboratory` — enter lab results
  - `/app/medication` — prescriptions
  - `/app/appointments` — schedule & track follow-up visits
  - `/app/reports` — patient summary, appointment, lab and high-risk reports
  - `/app/users` — role management (administrator only)

## 5. Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host — remember
to set the two `VITE_SUPABASE_*` environment variables on the host too.

## Notes

- The current RLS policies let any authenticated staff member read and write
  every clinical table — simplest to get running. If you need stricter
  separation (e.g. only `lab_personnel` can insert into `lab_results`), edit
  the policies in `supabase/schema.sql` to check `profiles.role` via a join,
  and re-run them.
- Hero images on the landing page are free-to-use photos from Unsplash
  (credited via the Unsplash License) — swap the URLs in
  `src/components/HeroCarousel.jsx` for your own clinic's photos any time.
