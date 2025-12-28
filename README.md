---

# FlowvaHub Rewards — Assessment

This project implements a Rewards page using React and Supabase per the assessment instructions.

## What I built

- A Rewards page that lists available rewards from Supabase
- Authentication with Supabase (email sign-in and google signup)
- Redeem flow that inserts redemption records into Supabase
- Proper handling of loading, empty, and error states
- Documentation and a SQL schema to create the required tables

## Setup (local)

1. Create a Supabase project at https://app.supabase.com
2. In the project settings, i get the anon public key and URL and set them in a local `.env` 

	VITE_SUPABASE_URL= My url
	VITE_SUPABASE_ANON_KEY= My anon key

3. I Run the SQL in `db/schema.sql` in Supabase SQL editor to create tables and sample rewards.
4.I Install deps and run the app:

	npm install
	npm run dev

5. Go to http://localhost:5173 to see the Rewards page.

### Demo mode

If you don't provide Supabase environment variables, the app will run in a demo mode using mock rewards data so you can work on UI without a Supabase project.

## Notes, assumptions & trade-offs

- This is a focused implementation: the app assumes you will provision a Supabase project and run the provided SQL to seed rewards and set up the `profiles` table.
- Auth uses supabase email sign in and google signup for simplicity and safety, this demonstrates real Supabase auth usage.
- The redeem flow creates a `redemptions` row; you may want to implement transactional logic or Postgres functions in production to deduct points atomically.

## Styling

- This project now uses Tailwind CSS for quicker UI iteration and consistent utility styles. After pulling changes run:

	npm install

	and then start the dev server as usual with `npm run dev`. Tailwind is configured via `tailwind.config.cjs` and the directives are in `src/index.css`.

## Tables used

- profiles: user metadata and points
- rewards: available rewards
- redemptions: records of user redemptions
 - claims: daily claim records (used for "Claim Today's Points")
 - earnings: earned events (optional)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




- Project Designed by Hammad Awowole