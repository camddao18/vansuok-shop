-- Run once in the Supabase SQL editor. Public bucket for product photos (uploads go through the server with the service-role key).
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;
