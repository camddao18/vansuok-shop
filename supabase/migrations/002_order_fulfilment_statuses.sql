-- Run once in the Supabase SQL editor (only if you already ran schema.sql before this change).
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending','paid','shipped','completed','cancelled'));
