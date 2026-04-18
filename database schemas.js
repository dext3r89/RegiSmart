
//ATTENDACE LOGS
create table public.attendance_logs (
  id uuid not null default gen_random_uuid (),
  student_id uuid null,
  status text null,
  verify_code integer null,
  updated_at timestamp without time zone null default now(),
  constraint attendance_logs_pkey primary key (id),
  constraint attendance_logs_student_id_fkey foreign KEY (student_id) references students (id) on delete CASCADE,
  constraint attendance_logs_status_check check (
    (
      status = any (
        array[
          'At School'::text,
          'Pending Pickup'::text,
          'Checked Out'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;


create table public.family_details (
  id uuid not null default gen_random_uuid (),
  student_id uuid null,
  mother_name text null,
  mother_email text null,
  mother_cell text null,
  mother_work text null,
  mother_address text null,
  father_name text null,
  father_email text null,
  father_cell text null,
  father_work text null,
  father_address text null,
  constraint family_details_pkey primary key (id),
  constraint family_details_student_id_fkey foreign KEY (student_id) references students (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.medical_info (
  id uuid not null default gen_random_uuid (),
  student_id uuid null,
  doctor_name text null,
  doctor_tel text null,
  medical_aid text null,
  medical_aid_number text null,
  allergies text null,
  constraint medical_info_pkey primary key (id),
  constraint medical_info_student_id_fkey foreign KEY (student_id) references students (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.profiles (
  id uuid not null,
  full_name text null,
  role text null,
  created_at timestamp without time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_role_check check (
    (
      role = any (
        array['parent'::text, 'teacher'::text, 'admin'::text]
      )
    )
  )
) TABLESPACE pg_default;


create table public.students (
  id uuid not null default gen_random_uuid (),
  full_name text not null,
  grade text not null,
  home_address text null,
  parent_id uuid null,
  created_at timestamp without time zone null default now(),
  constraint students_pkey primary key (id),
  constraint students_parent_id_fkey foreign KEY (parent_id) references profiles (id) on delete set null
) TABLESPACE pg_default;

create table public.transport_profiles (
  id uuid not null default gen_random_uuid (),
  student_id uuid not null,
  driver_name text null,
  driver_phone text null,
  vehicle_reg text null,
  transport_type text null,
  is_active boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint transport_profiles_pkey primary key (id),
  constraint transport_profiles_student_id_key unique (student_id),
  constraint transport_profiles_student_id_fkey foreign KEY (student_id) references students (id) on delete CASCADE,
  constraint transport_profiles_transport_type_check check (
    (
      transport_type = any (array['Taxi'::text, 'Bus'::text, 'Private'::text])
    )
  )
) TABLESPACE pg_default;
