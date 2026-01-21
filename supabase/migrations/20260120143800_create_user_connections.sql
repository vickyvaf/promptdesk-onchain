create table public.user_connections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  wallet_address text not null,
  platform text not null,
  account_id text,
  username text,
  
  -- Prevent duplicate connections for the same platform and wallet
  unique(wallet_address, platform)
);

-- RLS Policies
alter table public.user_connections enable row level security;

create policy "Enable read access for all users"
  on public.user_connections for select
  using (true);

create policy "Enable insert for authenticated users only"
  on public.user_connections for insert
  with check (auth.role() = 'authenticated');

create policy "Enable update for users based on wallet_address"
  on public.user_connections for update
  using (true);
  
create policy "Enable delete for users based on wallet_address"
  on public.user_connections for delete
  using (true);
