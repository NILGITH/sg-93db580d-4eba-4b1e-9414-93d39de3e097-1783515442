-- Ajouter la colonne avatar_url à la table profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;