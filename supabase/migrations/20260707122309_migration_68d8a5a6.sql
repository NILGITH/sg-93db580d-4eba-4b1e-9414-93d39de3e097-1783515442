-- Correction 2: Maintenant modifier l'enum user_role
ALTER TYPE user_role RENAME TO user_role_old;

CREATE TYPE user_role AS ENUM ('admin', 'secretary', 'commercial', 'accountant', 'proprietaire');

-- Migrer les données existantes
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING (
  CASE role::text
    WHEN 'super_admin' THEN 'admin'::user_role
    WHEN 'admin_agency' THEN 'admin'::user_role
    ELSE role::text::user_role
  END
);

-- Remettre le DEFAULT
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'commercial'::user_role;

DROP TYPE user_role_old;

-- Vérifier la migration
SELECT role, COUNT(*) as count FROM profiles GROUP BY role;