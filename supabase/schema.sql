-- Run in Supabase SQL editor. The app talks to these tables only from the server
-- with the service-role key, so RLS is on with no policies (browser access denied).

create table if not exists orders (
  code            bigint primary key,            -- also the payOS orderCode
  access_token    text not null,                 -- secret in the confirmation URL
  status          text not null default 'pending'
                  check (status in ('pending','paid','cancelled')),
  payment_method  text not null check (payment_method in ('payos')),
  items           jsonb not null,
  subtotal        integer not null,
  shipping_fee    integer not null,
  total           integer not null,
  customer        jsonb not null,
  payment_link_id text,
  checkout_url    text,
  created_at      timestamptz not null default now()
);
create index if not exists orders_created_at_idx on orders (created_at desc);
alter table orders enable row level security;

create table if not exists trade_suggestions (
  id         bigint generated always as identity primary key,
  trade      text not null,
  created_at timestamptz not null default now()
);
alter table trade_suggestions enable row level security;

-- Products currently live in src/data/catalog.ts (with `category` and `collection`).
-- When you want to manage them from the DB, mirror them here:
-- create table products (
--   id text primary key, slug text unique not null, name text not null,
--   category text not null, collection text not null, price integer not null,
--   data jsonb not null default '{}'
-- );
