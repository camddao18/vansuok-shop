-- Run once in the Supabase SQL editor. Products move from src/data/catalog.ts to the database.
create table if not exists products (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  category    text not null,
  collection  text not null,
  price       integer not null check (price >= 0),
  tint        text not null,
  art         jsonb not null,          -- { shirt, ink } colors for the drawn stand-in
  colors      jsonb,                   -- optional [{ id, name, hex }]
  description text not null default '',
  image       text,                    -- optional square photo URL
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table products enable row level security;

-- Seed the six launch tees (250.000 VND is the placeholder price).
insert into products (id, slug, name, category, collection, price, tint, art, description) values
  ('trading-01','trading-tee-01','Trading Tee — No. 01','tshirt','trading',250000,'#E9E7DF','{"shirt":"#111111","ink":"#C6F432"}','Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.'),
  ('navy-01','navy-tee-01','Navy Tee — No. 01','tshirt','navy',250000,'#D5DBF3','{"shirt":"#16245E","ink":"#FFFFFF"}','Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.'),
  ('nails-01','nails-tee-01','Nails Tee — No. 01','tshirt','nails',250000,'#FFD9C7','{"shirt":"#F7F6F1","ink":"#2B44FF"}','Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.'),
  ('trading-02','trading-tee-02','Trading Tee — No. 02','tshirt','trading',250000,'#DCE9B0','{"shirt":"#F7F6F1","ink":"#111111"}','Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.'),
  ('navy-02','navy-tee-02','Navy Tee — No. 02','tshirt','navy',250000,'#E9E7DF','{"shirt":"#F7F6F1","ink":"#16245E"}','Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.'),
  ('nails-02','nails-tee-02','Nails Tee — No. 02','tshirt','nails',250000,'#FFD9C7','{"shirt":"#111111","ink":"#FF5B1F"}','Profession-themed unisex tee in heavy 250gsm fabric. Sizes S–XXL.')
on conflict (id) do nothing;
