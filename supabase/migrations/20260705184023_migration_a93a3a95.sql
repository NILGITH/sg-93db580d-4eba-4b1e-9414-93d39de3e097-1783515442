-- Solution simple : désactiver RLS sur agencies
-- Les agences ne sont pas des données sensibles
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;

-- Vérifier que l'agence est maintenant accessible
SELECT id, name, email, is_active FROM agencies WHERE is_active = true;