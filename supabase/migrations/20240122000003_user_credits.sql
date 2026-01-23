-- User credits table (1:1 with profiles)
create table public.user_credits (
  user_id uuid primary key
    references public.profiles(id)
    on delete cascade,

  credits_remaining integer not null default 0,
  updated_at timestamptz default now()
);

-- Create RPC function to deduct credit safely
create or replace function public.deduct_credit(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.user_credits
  set credits_remaining = credits_remaining - 1,
      updated_at = now()
  where user_id = p_user_id;
end;
$$;

-- Create RPC function to refund credit safely
create or replace function public.refund_credit(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.user_credits
  set credits_remaining = credits_remaining + 1,
      updated_at = now()
  where user_id = p_user_id;
end;
$$;
