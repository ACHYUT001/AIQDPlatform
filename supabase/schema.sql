-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  role text check (role in ('contributor', 'client', 'admin')) default 'contributor',
  resume_url text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for skills
create table skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  skill_name text not null,
  proficiency text check (proficiency in ('beginner', 'intermediate', 'expert')) default 'beginner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table skills enable row level security;

create policy "Skills are viewable by everyone." on skills
  for select using (true);

create policy "Users can insert their own skills." on skills
  for insert with check (auth.uid() = user_id);

create policy "Users can update own skills." on skills
  for update using (auth.uid() = user_id);

create policy "Users can delete own skills." on skills
  for delete using (auth.uid() = user_id);

-- Set up Storage for Resumes
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false);

create policy "Resume images are publicly accessible." on storage.objects
  for select using (bucket_id = 'resumes');

create policy "Anyone can upload a resume." on storage.objects
  for insert with check (bucket_id = 'resumes');

create policy "Users can update their own resume." on storage.objects
  for update using (auth.uid() = owner);
