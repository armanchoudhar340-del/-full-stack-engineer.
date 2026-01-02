-- Create a table for storing user consents
CREATE TABLE IF NOT EXISTS consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  consent_type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('granted', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  previous_consent_id UUID REFERENCES consents(id),
  
  -- Prevent duplicate active consents of the same type for the same user (optional constraint, but good for integrity)
  -- For this scope, we allow history, so we don't enforce unique constraint on user_id + consent_type unless we want to strictly retire old ones.
  -- Let's just index user_id for fast lookups.
  CONSTRAINT consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own consents
CREATE POLICY "Users can view their own consents" ON consents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own consents
CREATE POLICY "Users can insert their own consents" ON consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can revoke their own consents (update status to revoked)
-- They should NOT be able to change other fields or set status to 'granted' if it was already revoked (though logic handles that)
-- Ideally we only allow updating 'status' and 'revoked_at'
CREATE POLICY "Users can revoke their own consents" ON consents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'revoked' -- Only allow updates that set status to revoked
  );

-- Policy: Admins can view all consents
-- Assuming we have a way to identify admins. use a specific email or a custom claim.
-- For this deliverable, we'll create a policy that checks a custom claim 'is_admin' OR specific email domain if needed.
-- Let's assume a function or claim exists, or commonly, use the service_role for backend scripts.
-- But since the requirement asks for an Admin Dashboard in the frontend, we need a way for a logged-in user to be an admin.
-- Placeholder: Allow a specific user email or metadata.
-- REPLACE 'admin@example.com' with the actual admin email or logic.
CREATE POLICY "Admins can view all consents" ON consents
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'admin@example.com' -- Simple check for demo purposes
    OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' -- Better approach
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consents_user_id ON consents(user_id);
CREATE INDEX IF NOT EXISTS idx_consents_status ON consents(status);
CREATE INDEX IF NOT EXISTS idx_consents_created_at ON consents(created_at);
