-- ============================================================
-- Antenatal Information System
-- Supabase schema: tables + row level security (RLS) policies
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================

-- ---------- 1. Roles & profiles ----------
create type user_role as enum (
  'administrator',
  'doctor',
  'nurse',
  'lab_personnel',
  'receptionist'
);

-- Extends auth.users with a role and display name.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role user_role not null default 'receptionist',
  created_at timestamptz not null default now()
);

-- ---------- 2. Patients ----------
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  patient_code text unique not null default ('NRT-' || to_char(now(), 'YYYYMM') || '-' || lpad(floor(random() * 9999)::text, 4, '0')),
  full_name text not null,
  age int,
  date_of_birth date,
  address text,
  phone_number text,
  marital_status text,
  occupation text,
  blood_group text,
  next_of_kin text,
  next_of_kin_phone text,
  registered_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------- 3. Clinical assessments ----------
create table if not exists clinical_assessments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  weight_kg numeric,
  blood_pressure text,
  temperature_c numeric,
  pulse_rate int,
  gestational_age_weeks int,
  fundal_height_cm numeric,
  fetal_heart_rate int,
  clinical_observations text,
  diagnosis text,
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  recorded_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------- 4. Laboratory results ----------
create table if not exists lab_results (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  test_type text not null,
  result_value text,
  reference_range text,
  notes text,
  recorded_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------- 5. Medications ----------
create table if not exists medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  drug_name text not null,
  dosage text,
  frequency text,
  duration text,
  prescribing_officer uuid references profiles (id),
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- 6. Appointments ----------
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  appointment_date date not null,
  appointment_time time not null,
  purpose text,
  healthcare_provider uuid references profiles (id),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'missed')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table patients enable row level security;
alter table clinical_assessments enable row level security;
alter table lab_results enable row level security;
alter table medications enable row level security;
alter table appointments enable row level security;

-- Any authenticated staff member can read their own profile plus the
-- directory of other staff (needed for "prescribing officer" dropdowns, etc).
create policy "profiles are readable by authenticated staff"
  on profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- All clinical tables: any authenticated staff member can read and write.
-- Tighten these per-role if you need stricter separation later
-- (e.g. only lab_personnel can insert into lab_results).
create policy "staff can read patients" on patients for select to authenticated using (true);
create policy "staff can insert patients" on patients for insert to authenticated with check (true);
create policy "staff can update patients" on patients for update to authenticated using (true);

create policy "staff can read assessments" on clinical_assessments for select to authenticated using (true);
create policy "staff can insert assessments" on clinical_assessments for insert to authenticated with check (true);

create policy "staff can read lab results" on lab_results for select to authenticated using (true);
create policy "staff can insert lab results" on lab_results for insert to authenticated with check (true);

create policy "staff can read medications" on medications for select to authenticated using (true);
create policy "staff can insert medications" on medications for insert to authenticated with check (true);

create policy "staff can read appointments" on appointments for select to authenticated using (true);
create policy "staff can insert appointments" on appointments for insert to authenticated with check (true);
create policy "staff can update appointments" on appointments for update to authenticated using (true);

-- ============================================================
-- Convenience: auto-create a profile row when a new auth user signs up.
-- Staff choose their own role at sign-up (doctor, nurse, lab_personnel,
-- receptionist) via user_metadata.role, so they land straight in their
-- own dashboard instead of waiting on an administrator. 'administrator'
-- can never be self-assigned this way — it's forced back to
-- 'receptionist' if someone tries to send it. Promote someone to
-- administrator afterwards from the User Management screen (as an
-- existing administrator) or directly in the Supabase table editor.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  requested_role text;
  safe_role public.user_role;
begin
  requested_role := new.raw_user_meta_data->>'role';

  if requested_role is null or requested_role = 'administrator'
     or requested_role not in ('doctor', 'nurse', 'lab_personnel', 'receptionist') then
    safe_role := 'receptionist'::public.user_role;
  else
    safe_role := requested_role::public.user_role;
  end if;

  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), safe_role);
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
