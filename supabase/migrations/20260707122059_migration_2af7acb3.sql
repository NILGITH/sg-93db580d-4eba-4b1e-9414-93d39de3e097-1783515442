-- ÉTAPE 1: Supprimer TOUTES les policies RLS (temporaire, ~30 secondes)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Vérifier que toutes les policies sont supprimées
SELECT COUNT(*) as policies_remaining FROM pg_policies WHERE schemaname = 'public';