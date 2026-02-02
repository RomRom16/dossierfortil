/*
  # Mise à jour du schéma des profils
  
  1. Modifications de la table profiles
    - Ajout du champ `full_name` (text) - Nom complet du candidat
    - Ajout du champ `roles` (text[]) - Liste des rôles
    - Le champ `job_title` reste pour compatibilité
  
  2. Modifications de la table experiences
    - Ajout du champ `location` (text) - Localisation
    - Ajout du champ `job_title` (text) - Poste occupé
    - Ajout du champ `sector` (text) - Secteur d'activité
    - Ajout du champ `responsibilities` (text) - Responsabilités en texte libre
    - Ajout du champ `technical_environment` (text) - Environnement technique
  
  3. Sécurité
    - RLS déjà activé
    - Politiques existantes conservées
*/

-- Ajouter les nouveaux champs à la table profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'roles'
  ) THEN
    ALTER TABLE profiles ADD COLUMN roles text[] DEFAULT '{}';
  END IF;
END $$;

-- Ajouter les nouveaux champs à la table experiences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'location'
  ) THEN
    ALTER TABLE experiences ADD COLUMN location text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE experiences ADD COLUMN job_title text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'sector'
  ) THEN
    ALTER TABLE experiences ADD COLUMN sector text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'responsibilities'
  ) THEN
    ALTER TABLE experiences ADD COLUMN responsibilities text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'technical_environment'
  ) THEN
    ALTER TABLE experiences ADD COLUMN technical_environment text DEFAULT '';
  END IF;
END $$;
