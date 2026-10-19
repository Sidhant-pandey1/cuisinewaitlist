/*
# Create public waitlist signups

1. New Tables
- `waitlist_signups`
- `id` (uuid, primary key) uniquely identifies each signup.
- `email` (text, unique) stores the visitor's email address.
- `first_name` (text) stores the visitor's optional first name.
- `created_at` (timestamptz) records when the visitor joined.

2. Security
- Enable row level security on `waitlist_signups`.
- Allow anonymous and authenticated visitors to submit a signup.
- Do not expose signup records to the public browser client.
- Keep update and delete access disabled for the public client.

3. Important Notes
- Email uniqueness prevents duplicate waitlist entries.
- This is a single-tenant, no-sign-in waitlist.
*/

CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist_signups;
CREATE POLICY "Public can join waitlist"
  ON public.waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(email)) BETWEEN 3 AND 320
    AND position('@' IN email) > 1
    AND position('.' IN split_part(email, '@', 2)) > 1
    AND (first_name IS NULL OR length(trim(first_name)) BETWEEN 1 AND 80)
  );

DROP POLICY IF EXISTS "Public cannot read waitlist" ON public.waitlist_signups;
CREATE POLICY "Public cannot read waitlist"
  ON public.waitlist_signups
  FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Public cannot update waitlist" ON public.waitlist_signups;
CREATE POLICY "Public cannot update waitlist"
  ON public.waitlist_signups
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete waitlist" ON public.waitlist_signups;
CREATE POLICY "Public cannot delete waitlist"
  ON public.waitlist_signups
  FOR DELETE
  TO anon, authenticated
  USING (false);
