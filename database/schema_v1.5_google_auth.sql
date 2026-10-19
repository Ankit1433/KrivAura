-- Apply this migration after the existing user schema and before enabling
-- Google sign-in on the API.
ALTER TABLE users
  ALTER COLUMN password DROP NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id_unique
  ON users (google_id)
  WHERE google_id IS NOT NULL;
