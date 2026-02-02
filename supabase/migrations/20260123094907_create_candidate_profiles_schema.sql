/*
  # Create Candidate Profiles Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `job_title` (text) - Intitulé du poste
      - `candidate_description` (text) - Description du candidat
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `general_expertises`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `expertise` (text)
      - `created_at` (timestamptz)
    
    - `tools`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `tool_name` (text)
      - `created_at` (timestamptz)
    
    - `experiences`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `company` (text) - Entreprise
      - `start_date` (date) - Date de début
      - `end_date` (date) - Date de fin
      - `context` (text) - Contexte
      - `project` (text) - Projet
      - `expertises` (text[]) - Expertises spécifiques à ce projet
      - `tools_used` (text[]) - Outils utilisés
      - `responsibilities` (text[]) - Responsabilités
      - `created_at` (timestamptz)
    
    - `educations`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key)
      - `degree_or_certification` (text) - Diplôme ou certification
      - `institution` (text) - Institution
      - `year` (integer) - Année d'obtention
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (can be restricted later)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  candidate_description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create general_expertises table
CREATE TABLE IF NOT EXISTS general_expertises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expertise text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  context text DEFAULT '',
  project text DEFAULT '',
  expertises text[] DEFAULT '{}',
  tools_used text[] DEFAULT '{}',
  responsibilities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create educations table
CREATE TABLE IF NOT EXISTS educations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  degree_or_certification text NOT NULL,
  institution text DEFAULT '',
  year integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_expertises ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (SELECT and INSERT)
-- Profiles
CREATE POLICY "Allow public read access to profiles"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to profiles"
  ON profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to profiles"
  ON profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to profiles"
  ON profiles FOR DELETE
  TO anon, authenticated
  USING (true);

-- General Expertises
CREATE POLICY "Allow public read access to general_expertises"
  ON general_expertises FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to general_expertises"
  ON general_expertises FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public delete to general_expertises"
  ON general_expertises FOR DELETE
  TO anon, authenticated
  USING (true);

-- Tools
CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to tools"
  ON tools FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public delete to tools"
  ON tools FOR DELETE
  TO anon, authenticated
  USING (true);

-- Experiences
CREATE POLICY "Allow public read access to experiences"
  ON experiences FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to experiences"
  ON experiences FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to experiences"
  ON experiences FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to experiences"
  ON experiences FOR DELETE
  TO anon, authenticated
  USING (true);

-- Educations
CREATE POLICY "Allow public read access to educations"
  ON educations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to educations"
  ON educations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to educations"
  ON educations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to educations"
  ON educations FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_general_expertises_profile_id ON general_expertises(profile_id);
CREATE INDEX IF NOT EXISTS idx_tools_profile_id ON tools(profile_id);
CREATE INDEX IF NOT EXISTS idx_experiences_profile_id ON experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_educations_profile_id ON educations(profile_id);
