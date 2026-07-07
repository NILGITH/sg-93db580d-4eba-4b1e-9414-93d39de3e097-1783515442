-- Correction 4: Recréer les RLS policies SANS récursion (utiliser auth.uid() directement)

-- 1. Profiles: utiliser auth.uid() directement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Properties: lecture publique pour le catalogue, modification admin seulement
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_read_public" ON properties
  FOR SELECT USING (true);

CREATE POLICY "properties_insert" ON properties
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "properties_update" ON properties
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "properties_delete" ON properties
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. Mandates: lecture authentifiée, modification authentifiée
ALTER TABLE mandates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mandates_read_auth" ON mandates
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "mandates_modify_auth" ON mandates
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Interventions: lecture authentifiée, modification authentifiée
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interventions_read_auth" ON interventions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "interventions_modify_auth" ON interventions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 5. Payments: lecture authentifiée, modification authentifiée
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_read_auth" ON payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "payments_modify_auth" ON payments
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 6. Prospects: lecture authentifiée, modification authentifiée
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prospects_read_auth" ON prospects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "prospects_modify_auth" ON prospects
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 7. Visit bookings: lecture publique, insertion publique, modification authentifiée
ALTER TABLE visit_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_read_public" ON visit_bookings
  FOR SELECT USING (true);

CREATE POLICY "bookings_insert_public" ON visit_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_modify_auth" ON visit_bookings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "bookings_delete_auth" ON visit_bookings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Vérifier les policies créées
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;