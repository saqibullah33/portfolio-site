-- Add optional X post link to each meetup. Safe to re-run.
ALTER TABLE events ADD COLUMN IF NOT EXISTS x_post_url TEXT;
