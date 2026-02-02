-- Update experiences table to match new CV structure
-- Add new columns and modify existing ones

-- Add new columns
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location text DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS job_title text DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS sector text DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS responsibilities text DEFAULT '';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS technical_environment text DEFAULT '';

-- Update existing columns to match new structure
-- Note: expertises and tools_used columns are kept for backward compatibility
-- but will not be used in the new form structure