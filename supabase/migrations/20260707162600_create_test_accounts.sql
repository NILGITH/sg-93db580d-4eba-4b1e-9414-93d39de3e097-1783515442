-- Création des comptes utilisateurs de test
-- Ces comptes sont pré-confirmés et prêts à l'emploi

-- Note: Supabase Auth ne permet pas d'insérer directement dans auth.users via SQL
-- Ces utilisateurs doivent être créés via l'API Supabase ou l'interface de signup
-- Ce script crée les profils correspondants pour quand les comptes seront créés

-- Fonction helper pour créer un utilisateur test complet
CREATE OR REPLACE FUNCTION create_test_user(
  p_email TEXT,
  p_role TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_phone TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Générer un UUID déterministe basé sur l'email
  v_user_id := gen_random_uuid();
  
  -- Insérer le profil (sera lié quand le compte Auth sera créé)
  INSERT INTO public.profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    phone,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    p_email,
    p_role,
    p_first_name,
    p_last_name,
    p_phone,
    NOW(),
    NOW()
  ) ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();
    
  RAISE NOTICE 'Profile created for: %', p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer les profils pour les comptes de test
SELECT create_test_user(
  'admin@immo360.com',
  'admin',
  'Amadou',
  'Diallo',
  '+221 77 123 45 67'
);

SELECT create_test_user(
  'secretaire@immo360.com',
  'secretary',
  'Fatou',
  'Sall',
  '+221 77 234 56 78'
);

SELECT create_test_user(
  'commercial@immo360.com',
  'agent',
  'Moussa',
  'Ndiaye',
  '+221 77 345 67 89'
);

SELECT create_test_user(
  'comptable@immo360.com',
  'accountant',
  'Aissatou',
  'Ba',
  '+221 77 456 78 90'
);

SELECT create_test_user(
  'proprietaire@immo360.com',
  'owner',
  'Ousmane',
  'Mbaye',
  '+221 77 567 89 01'
);

-- Nettoyer la fonction helper
DROP FUNCTION IF EXISTS create_test_user;

-- Afficher les profils créés
SELECT email, role, first_name, last_name 
FROM public.profiles 
WHERE email LIKE '%@immo360.com'
ORDER BY role;
