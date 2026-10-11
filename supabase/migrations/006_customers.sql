create table if not exists customers (
  id            text primary key,
  email         text not null unique,
  name          text not null,
  phone         text not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);
alter table customers enable row level security;

alter table orders add column if not exists customer_id text references customers (id);
create index if not exists orders_customer_id_idx on orders (customer_id);
