-- Correction 1: Supprimer le DEFAULT avant de modifier l'enum
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- Vérifier
SELECT column_name, column_default, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';