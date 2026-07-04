-- RLS sur agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_agencies" ON agencies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "users_own_agency" ON agencies
  FOR SELECT USING (
    id IN (
      SELECT agency_id FROM profiles WHERE profiles.id = auth.uid()
    )
  );

-- RLS sur profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "super_admin_all_profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'super_admin'
    )
  );

CREATE POLICY "agency_admins_agency_profiles" ON profiles
  FOR SELECT USING (
    agency_id IN (
      SELECT agency_id FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin_agence')
    )
  );

-- RLS sur owners
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_same_agency" ON owners
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM profiles WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "owner_own_data" ON owners
  FOR SELECT USING (user_id = auth.uid());

-- RLS sur properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_same_agency" ON properties
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM profiles WHERE profiles.id = auth.uid()
    )
  );

-- RLS sur mandates
ALTER TABLE mandates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mandates_same_agency" ON mandates
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM profiles WHERE profiles.id = auth.uid()
    )
  );

-- RLS sur payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_same_agency" ON payments
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM profiles WHERE profiles.id = auth.uid()
    )
  );

-- Trigger pour créer automatiquement le profile après signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, is_active)
  VALUES (NEW.id, 'commercial', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insérer une agence de démo pour démarrage rapide
INSERT INTO agencies (name, email, phone, city, is_active)
VALUES ('Agence IMMO360 Demo', 'contact@immo360.demo', '+33 1 23 45 67 89', 'Paris', true);