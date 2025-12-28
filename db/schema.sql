-- Supabase schema for Rewards assessment

create table if not exists profiles (
  id uuid primary key,
  email text,
  full_name text,
  points integer default 0
);

create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  points_required integer not null,
  created_at timestamptz default now()
);

create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  reward_id uuid references rewards(id) on delete cascade,
  created_at timestamptz default now()
);

-- claims table to allow once-per-day point claims
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  claim_date date not null,
  points integer default 5,
  created_at timestamptz default now()
);

create unique index if not exists claims_user_date_unique on claims(user_id, claim_date);

-- earnings table for other earned events
create table if not exists earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  source text,
  points integer not null,
  created_at timestamptz default now()
);

-- seed sample rewards
insert into rewards (title, description, image_url, points_required) values
('$5 Bank Transfer', 'The $5 equivalent will be transferred to your bank account.', 'https://picsum.photos/seed/r1/400/300', 5000),
('$5 PayPal International', 'Receive a $5 PayPal balance transfer directly to your PayPal account email.', 'https://picsum.photos/seed/r2/400/300', 5000),
('$5 Virtual Visa Card', 'Use your $5 prepaid card to shop anywhere Visa is accepted online.', 'https://picsum.photos/seed/r3/400/300', 5000),
('$5 Apple Gift Card', 'Redeem this $5 Apple Gift Card for apps, games, music, movies, and more.', 'https://picsum.photos/seed/r4/400/300', 5000),
('$5 Google Play Card', 'Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more.', 'https://picsum.photos/seed/r5/400/300', 5000),
('$5 Amazon Gift Card', 'Get a $5 digital gift card to spend on your favorite tools or platforms.', 'https://picsum.photos/seed/r6/400/300', 5000),
('$10 Amazon Gift Card', 'Get a $10 digital gift card to spend on your favorite tools or platforms.', 'https://picsum.photos/seed/r7/400/300', 10000),
('Free Udemy Course', 'Coming Soon!', 'https://picsum.photos/seed/r8/400/300', 0)
ON CONFLICT DO NOTHING;

-- Note: create profiles rows when users sign up via Supabase Auth and mirror into profiles via an auth trigger.
