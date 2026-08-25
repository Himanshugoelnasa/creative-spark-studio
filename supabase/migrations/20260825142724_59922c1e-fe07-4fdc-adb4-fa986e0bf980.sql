-- ============ enums ============
create type public.app_role as enum ('admin','moderator','user');
create type public.generation_type as enum ('image','video','voice','music','complete_video');
create type public.generation_status as enum ('queued','processing','completed','failed','cancelled');
create type public.asset_kind as enum ('image','video','audio','other');
create type public.asset_source as enum ('uploaded','generated');
create type public.credit_txn_kind as enum ('grant','spend','purchase','refund');
create type public.project_status as enum ('draft','in_progress','completed');
create type public.api_key_status as enum ('active','revoked');

-- ============ shared updated_at trigger ============
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Profiles are viewable by signed-in users" on public.profiles for select to authenticated using (true);
create policy "Users can insert their own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();

-- ============ user_roles ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- ============ credits ============
create table public.credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.credits to authenticated;
grant all on public.credits to service_role;
alter table public.credits enable row level security;
create policy "Users can view their own credits" on public.credits for select to authenticated using (auth.uid() = user_id);
create policy "Users can update their own credits" on public.credits for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger update_credits_updated_at before update on public.credits for each row execute function public.update_updated_at_column();

-- ============ projects ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled project',
  description text,
  thumbnail_url text,
  status public.project_status not null default 'draft',
  is_favorite boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Users manage their own projects" on public.projects for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger update_projects_updated_at before update on public.projects for each row execute function public.update_updated_at_column();
create index projects_user_id_idx on public.projects(user_id);

-- ============ generations ============
create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  type public.generation_type not null,
  prompt text not null default '',
  negative_prompt text,
  model text not null default '',
  status public.generation_status not null default 'queued',
  progress integer not null default 0,
  output_url text,
  thumbnail_url text,
  error text,
  credits_cost integer not null default 0,
  is_favorite boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.generations to authenticated;
grant all on public.generations to service_role;
alter table public.generations enable row level security;
create policy "Users manage their own generations" on public.generations for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger update_generations_updated_at before update on public.generations for each row execute function public.update_updated_at_column();
create index generations_user_id_idx on public.generations(user_id);
create index generations_project_id_idx on public.generations(project_id);

-- ============ credit_transactions ============
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  kind public.credit_txn_kind not null,
  description text,
  generation_id uuid references public.generations(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select, insert on public.credit_transactions to authenticated;
grant all on public.credit_transactions to service_role;
alter table public.credit_transactions enable row level security;
create policy "Users can view their own transactions" on public.credit_transactions for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on public.credit_transactions for insert to authenticated with check (auth.uid() = user_id);
create index credit_transactions_user_id_idx on public.credit_transactions(user_id);

-- ============ assets ============
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  generation_id uuid references public.generations(id) on delete set null,
  name text not null default 'Untitled asset',
  kind public.asset_kind not null default 'image',
  folder text not null default 'My Assets',
  url text,
  thumbnail_url text,
  size_bytes bigint,
  mime_type text,
  source public.asset_source not null default 'generated',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.assets to authenticated;
grant all on public.assets to service_role;
alter table public.assets enable row level security;
create policy "Users manage their own assets" on public.assets for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger update_assets_updated_at before update on public.assets for each row execute function public.update_updated_at_column();
create index assets_user_id_idx on public.assets(user_id);

-- ============ notifications ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  kind text not null default 'info',
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "Users manage their own notifications" on public.notifications for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index notifications_user_id_idx on public.notifications(user_id);

-- ============ api_keys (metadata only, never secrets) ============
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  label text,
  masked_hint text,
  status public.api_key_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.api_keys to authenticated;
grant all on public.api_keys to service_role;
alter table public.api_keys enable row level security;
create policy "Users manage their own api keys" on public.api_keys for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger update_api_keys_updated_at before update on public.api_keys for each row execute function public.update_updated_at_column();

-- ============ catalogs ============
create table public.models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  provider text not null,
  type public.generation_type not null,
  description text,
  speed text,
  quality text,
  cost_per_run integer not null default 0,
  badge text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.models to authenticated;
grant all on public.models to service_role;
alter table public.models enable row level security;
create policy "Models readable by signed-in users" on public.models for select to authenticated using (true);
create policy "Admins manage models" on public.models for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger update_models_updated_at before update on public.models for each row execute function public.update_updated_at_column();

create table public.voices (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'Narrator',
  language text not null default 'English',
  accent text,
  gender text,
  description text,
  avatar_url text,
  preview_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.voices to authenticated;
grant all on public.voices to service_role;
alter table public.voices enable row level security;
create policy "Voices readable by signed-in users" on public.voices for select to authenticated using (true);
create policy "Admins manage voices" on public.voices for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger update_voices_updated_at before update on public.voices for each row execute function public.update_updated_at_column();

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  category text not null default 'YouTube',
  duration_seconds integer,
  preview_url text,
  thumbnail_url text,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.templates to authenticated;
grant all on public.templates to service_role;
alter table public.templates enable row level security;
create policy "Templates readable by signed-in users" on public.templates for select to authenticated using (true);
create policy "Admins manage templates" on public.templates for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger update_templates_updated_at before update on public.templates for each row execute function public.update_updated_at_column();

-- ============ signup bootstrap ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    split_part(new.email,'@',1) || '_' || substr(replace(new.id::text,'-',''),1,6),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  insert into public.credits (user_id, balance)
  values (new.id, 1200)
  on conflict (user_id) do nothing;

  insert into public.credit_transactions (user_id, amount, kind, description)
  values (new.id, 1200, 'grant', 'Welcome credits');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();