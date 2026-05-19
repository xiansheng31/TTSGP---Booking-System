-- ============================================================
-- TTSGP Booking System — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- USERS
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  employee_id   text not null unique,
  name          text not null,
  email         text not null unique,
  department    text not null default '',
  role          text not null default 'employee' check (role in ('employee', 'admin', 'super_admin')),
  phone         text,
  created_at    timestamptz not null default now()
);

-- ROOMS
create table if not exists public.rooms (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('discussion', 'training')),
  capacity    int not null default 10,
  facilities  text[] not null default '{}',
  photo_url   text,
  status      text not null default 'available' check (status in ('available', 'maintenance', 'inactive')),
  rules       text,
  location    text not null default '',
  floor       int not null default 1,
  created_at  timestamptz not null default now()
);

-- BOOKINGS
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  room_id       uuid not null references public.rooms(id) on delete cascade,
  booking_date  date not null,
  start_time    time not null,
  end_time      time not null,
  title         text not null default 'Meeting',
  description   text,
  participants  text[] not null default '{}',
  status        text not null default 'pending' check (status in ('pending', 'approved', 'cancelled', 'completed')),
  created_at    timestamptz not null default now(),
  constraint no_overlap exclude using gist (
    room_id with =,
    booking_date with =,
    tsrange(
      (booking_date::text || ' ' || start_time::text)::timestamp,
      (booking_date::text || ' ' || end_time::text)::timestamp
    ) with &&
  ) where (status in ('pending', 'approved'))
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ANNOUNCEMENTS
create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text not null,
  publish_date  date not null default current_date,
  created_at    timestamptz not null default now()
);

-- AUDIT LOGS
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete set null,
  action      text not null,
  details     text,
  created_at  timestamptz not null default now()
);

-- SYSTEM SETTINGS
create table if not exists public.system_settings (
  id                  int primary key default 1,
  buffer_minutes      int not null default 15,
  max_booking_hours   int not null default 4,
  operating_start     time not null default '07:00',
  operating_end       time not null default '22:00',
  require_approval    boolean not null default true,
  max_advance_days    int not null default 30
);
insert into public.system_settings default values on conflict do nothing;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.users          enable row level security;
alter table public.rooms          enable row level security;
alter table public.bookings       enable row level security;
alter table public.notifications  enable row level security;
alter table public.announcements  enable row level security;
alter table public.audit_logs     enable row level security;
alter table public.system_settings enable row level security;

-- USERS policies
create policy "Users can view all users" on public.users for select to authenticated using (true);
create policy "Users can update own profile" on public.users for update to authenticated using (auth.uid() = id);

-- ROOMS policies
create policy "Everyone can view rooms" on public.rooms for select to authenticated using (true);
create policy "Admins can manage rooms" on public.rooms for all to authenticated
  using (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'super_admin')));

-- BOOKINGS policies
create policy "Users view own bookings" on public.bookings for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'super_admin')));
create policy "Users create own bookings" on public.bookings for insert to authenticated
  with check (user_id = auth.uid());
create policy "Users update own bookings" on public.bookings for update to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'super_admin')));

-- NOTIFICATIONS policies
create policy "Users view own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update to authenticated using (user_id = auth.uid());

-- ANNOUNCEMENTS policies
create policy "Everyone views announcements" on public.announcements for select to authenticated using (true);
create policy "Admins manage announcements" on public.announcements for all to authenticated
  using (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'super_admin')));

-- AUDIT LOGS policies
create policy "Admins view audit logs" on public.audit_logs for select to authenticated
  using (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'super_admin')));
create policy "System can insert audit logs" on public.audit_logs for insert to authenticated with check (true);

-- SYSTEM SETTINGS policies
create policy "Everyone reads settings" on public.system_settings for select to authenticated using (true);
create policy "Admins update settings" on public.system_settings for update to authenticated
  using (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'super_admin')));

-- ============================================================
-- FUNCTION: auto-create user profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, employee_id, name, email)
  values (
    new.id,
    'EMP-' || upper(substring(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SEED DATA (optional — remove in production)
-- ============================================================
insert into public.rooms (name, type, capacity, facilities, status, location, floor) values
  ('Boardroom Alpha',  'discussion', 12, '{tv,zoom,whiteboard}',       'available', 'Block A', 3),
  ('Focus Pod 1',      'discussion',  4, '{whiteboard}',               'available', 'Block A', 2),
  ('Focus Pod 2',      'discussion',  4, '{whiteboard}',               'available', 'Block A', 2),
  ('Training Hall',    'training',   50, '{projector,tv,whiteboard}',  'available', 'Block B', 1),
  ('Workshop Room',    'training',   20, '{projector,whiteboard,zoom}','available', 'Block B', 2),
  ('Executive Suite',  'discussion',  8, '{tv,zoom}',                  'available', 'Block C', 4)
on conflict do nothing;

insert into public.announcements (title, content, publish_date) values
  ('System Launch', 'The TTSGP Booking System is now live. Please refer to the user guide for instructions.', current_date),
  ('Maintenance Notice', 'Training Hall will be under maintenance on the last Friday of each month.', current_date)
on conflict do nothing;
