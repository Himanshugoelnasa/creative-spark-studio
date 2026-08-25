# Supabase database + default login

Set up the full AI Creative Studio data model in the connected Supabase project, seed one ready-to-use account (`admin@studio.local`), and add a simple email/password sign-in page plus a protected area so the credentials can be tested immediately.

## Default account

- Email: `admin@studio.local`
- Password: `StudioAdmin123!` (change after first sign-in)

The account is created pre-confirmed, so it can sign in right away. `.local` addresses cannot receive mail, so email confirmation and password reset by email won't work for it — email/password sign-in for real users still will.

## Database schema

One migration creating the studio tables, each with row-level security so users only reach their own rows, timestamps, and an `updated_at` trigger:

- `profiles` — display name, username, avatar, bio; auto-created on signup by a trigger on new auth users.
- `app_role` enum + `user_roles` — roles kept in a separate table with a `has_role()` security-definer function (never on profiles, to avoid privilege escalation).
- `credits` — balance per user, seeded with a starting balance on signup.
- `credit_transactions` — amount, kind (grant/spend/purchase/refund), description, related generation.
- `projects` — name, description, thumbnail, status, favorite, archived.
- `generations` — type (image/video/voice/music/complete_video), prompt, negative prompt, model, status (queued/processing/completed/failed), progress, output URL, thumbnail URL, error, JSON metadata, project reference, favorite, timestamps for started/completed.
- `assets` — name, kind, folder, URL, thumbnail, size, mime type, source (uploaded/generated), project reference.
- `notifications` — title, body, kind, read flag, link.
- `api_keys` — provider, label, masked hint, status, created date. Only non-secret metadata is stored; actual secrets go in server-side secret storage, never in the table or the browser.
- `models`, `voices`, `templates` — shared catalog tables, readable by any signed-in user, writable only by admins.

## Login UI

- `/auth` — email + password sign-in and sign-up on one page, with validation, loading and error states, toasts, dark premium styling using design tokens.
- Protected area under the integration-managed `_authenticated` gate: `/dashboard` showing the signed-in user's profile, credit balance, and a sign-out button.
- Root landing route gets a sign-in / go-to-dashboard call to action driven by real session state.
- Session handling wired once in the root route so signing in and out updates the UI immediately.

## Technical notes

- Schema goes through the migration tool; every new public table gets explicit GRANTs plus RLS policies scoped to `auth.uid()`.
- The default user is created with the Supabase Admin API from a one-off server-side script using the service-role key (auth users cannot be inserted by SQL); the profile, role and credit rows follow from the signup trigger.
- Auth is configured with auto-confirm so the seeded account and new signups can sign in without email confirmation.
- Reads use the browser Supabase client under RLS; nothing privileged reaches the client.
