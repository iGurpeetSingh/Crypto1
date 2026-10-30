-- Crypto1 production auth and INR payment ledger (Supabase/Postgres)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  email_verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz,
  balance_inr numeric(14,2) not null default 0 check (balance_inr >= 0)
);

create table if not exists public.auth_otps (
  email text not null,
  purpose text not null check (purpose in ('login','register')),
  otp_hash text not null,
  expires_at timestamptz not null,
  full_name text not null default '',
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  primary key(email,purpose)
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_order_id text not null unique,
  provider_payment_id text unique,
  user_id uuid not null references public.profiles(id),
  email text not null,
  amount_inr numeric(14,2) not null check (amount_inr > 0),
  status text not null default 'created',
  created_at timestamptz not null default now(),
  captured_at timestamptz
);

-- Atomic, idempotent credit: the same payment order can never credit twice.
create or replace function public.credit_crypto1_wallet(
  p_user_id uuid, p_payment_order_id uuid, p_amount_inr numeric
) returns jsonb language plpgsql security definer set search_path=public as $$
declare credited numeric(14,2);
begin
  update payment_orders set status='credited'
   where id=p_payment_order_id and user_id=p_user_id and status='captured';
  if not found then
    select balance_inr into credited from profiles where id=p_user_id;
    return jsonb_build_object('credited',false,'balanceInr',credited);
  end if;
  update profiles set balance_inr=balance_inr+p_amount_inr where id=p_user_id
   returning balance_inr into credited;
  return jsonb_build_object('credited',true,'balanceInr',credited);
end; $$;

alter table public.profiles enable row level security;
alter table public.auth_otps enable row level security;
alter table public.payment_orders enable row level security;
-- Do not add public policies. Server routes use the Supabase service-role key only.

REVOKE ALL ON FUNCTION public.credit_crypto1_wallet(uuid, uuid, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.credit_crypto1_wallet(uuid, uuid, numeric) TO service_role;
