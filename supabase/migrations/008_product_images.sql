-- Product gallery: ordered list of photo URLs. `image` stays the cover (first photo) for cards.
alter table products add column if not exists images jsonb;
