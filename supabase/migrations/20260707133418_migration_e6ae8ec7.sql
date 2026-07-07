-- ============================================
-- IMMO360 - Suppression complète de l'ancienne structure
-- ============================================

-- Désactiver temporairement les contraintes
SET session_replication_role = replica;

-- Supprimer toutes les tables existantes
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS faq_items CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS interventions CASCADE;
DROP TABLE IF EXISTS contractors CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS visit_bookings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS prospects CASCADE;
DROP TABLE IF EXISTS mandates CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS agencies CASCADE;

-- Supprimer les anciens ENUMs
DROP TYPE IF EXISTS property_status CASCADE;
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS mandate_type CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- ============================================
-- CRÉATION DES NOUVEAUX ENUMs
-- ============================================

CREATE TYPE user_role AS ENUM (
  'admin',
  'agent',
  'secretary',
  'accountant',
  'provider',
  'owner'
);

CREATE TYPE property_type AS ENUM (
  'appartement',
  'maison',
  'villa',
  'terrain',
  'bureau',
  'commerce',
  'immeuble',
  'studio'
);

CREATE TYPE property_status AS ENUM (
  'disponible',
  'loue',
  'vendu',
  'reserve'
);

CREATE TYPE transaction_type AS ENUM (
  'vente',
  'location'
);

CREATE TYPE payment_method AS ENUM (
  'especes',
  'mobile_money',
  'carte',
  'cheque',
  'virement'
);

CREATE TYPE payment_type AS ENUM (
  'loyer',
  'acompte',
  'reservation',
  'caution',
  'frais'
);

CREATE TYPE visit_status AS ENUM (
  'en_attente',
  'confirmee',
  'effectuee',
  'annulee'
);

CREATE TYPE booking_status AS ENUM (
  'en_attente',
  'confirmee',
  'annulee',
  'terminee'
);

CREATE TYPE intervention_type AS ENUM (
  'plomberie',
  'peinture',
  'climatisation',
  'maconnerie',
  'nettoyage',
  'electricite',
  'jardinage',
  'serrurerie',
  'autre'
);

CREATE TYPE intervention_status AS ENUM (
  'planifiee',
  'en_cours',
  'terminee',
  'validee',
  'annulee'
);

CREATE TYPE prospect_status AS ENUM (
  'nouveau',
  'contacte',
  'qualifie',
  'negocie',
  'converti',
  'perdu'
);

CREATE TYPE demand_type AS ENUM (
  'visite',
  'information',
  'reservation'
);

CREATE TYPE contract_type AS ENUM (
  'location',
  'vente',
  'gestion'
);

CREATE TYPE contract_status AS ENUM (
  'brouillon',
  'en_cours',
  'termine',
  'resilie'
);

CREATE TYPE report_type AS ENUM (
  'mensuel',
  'trimestriel',
  'semestriel',
  'annuel'
);

CREATE TYPE notification_type AS ENUM (
  'visite',
  'reservation',
  'prospect',
  'intervention',
  'paiement',
  'rapport',
  'contrat'
);

-- ============================================
-- TABLE: profiles (utilisateurs)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'agent',
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================
-- TABLE: owners (propriétaires/mandants)
-- ============================================
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  id_card_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_read_auth" ON owners
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "owners_modify_auth" ON owners
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_owners_user ON owners(user_id);
CREATE INDEX idx_owners_email ON owners(email);

-- ============================================
-- TABLE: properties (biens immobiliers)
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  transaction_type transaction_type NOT NULL,
  status property_status DEFAULT 'disponible',
  
  -- Localisation
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  commune TEXT,
  quartier TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Caractéristiques
  surface_area DECIMAL(10, 2),
  rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor INTEGER,
  
  -- Prix
  price DECIMAL(12, 2),
  rental_price DECIMAL(10, 2),
  charges DECIMAL(10, 2),
  
  -- Médias et documents
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Équipements et features
  equipments JSONB DEFAULT '[]'::JSONB,
  features JSONB DEFAULT '{}'::JSONB,
  
  -- Publication
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_read_public" ON properties
  FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "properties_modify_auth" ON properties
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_transaction ON properties(transaction_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_published ON properties(published);
CREATE INDEX idx_properties_owner ON properties(owner_id);

-- ============================================
-- TABLE: tenants (locataires)
-- ============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  id_card_number TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  monthly_rent DECIMAL(10, 2),
  deposit_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'ended')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_read_auth" ON tenants
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "tenants_modify_auth" ON tenants
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_tenants_status ON tenants(status);

-- ============================================
-- TABLE: prospects
-- ============================================
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  demand_type demand_type NOT NULL,
  status prospect_status DEFAULT 'nouveau',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  budget DECIMAL(12, 2),
  message TEXT,
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prospects_read_auth" ON prospects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "prospects_modify_auth" ON prospects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_assigned ON prospects(assigned_to);
CREATE INDEX idx_prospects_property ON prospects(property_id);

-- ============================================
-- TABLE: visits (demandes de visite)
-- ============================================
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT,
  preferred_date TIMESTAMPTZ NOT NULL,
  message TEXT,
  status visit_status DEFAULT 'en_attente',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visits_insert_public" ON visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "visits_read_auth" ON visits
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "visits_modify_auth" ON visits
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_visits_property ON visits(property_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_date ON visits(preferred_date);

-- ============================================
-- TABLE: bookings (réservations)
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
  
  -- Client info
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  
  -- Dates de réservation
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  
  -- Prix
  total_price DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  deposit_paid BOOLEAN DEFAULT false,
  
  -- Statut
  status booking_status DEFAULT 'en_attente',
  
  -- Paiement
  payment_method payment_method,
  payment_reference TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_insert_public" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_read_auth" ON bookings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "bookings_modify_auth" ON bookings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);

-- ============================================
-- TABLE: providers (prestataires)
-- ============================================
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty intervention_type NOT NULL,
  siret TEXT,
  address TEXT,
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "providers_read_auth" ON providers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "providers_modify_auth" ON providers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_providers_user ON providers(user_id);
CREATE INDEX idx_providers_specialty ON providers(specialty);

-- ============================================
-- TABLE: interventions
-- ============================================
CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  intervention_type intervention_type NOT NULL,
  status intervention_status DEFAULT 'planifiee',
  
  -- Coûts
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  
  -- Dates
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  
  -- Photos
  photos_before TEXT[] DEFAULT ARRAY[]::TEXT[],
  photos_after TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Commentaires
  provider_comment TEXT,
  agent_comment TEXT,
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interventions_read_auth" ON interventions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "interventions_modify_auth" ON interventions
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_interventions_property ON interventions(property_id);
CREATE INDEX idx_interventions_provider ON interventions(provider_id);
CREATE INDEX idx_interventions_status ON interventions(status);

-- ============================================
-- TABLE: payments
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  
  payment_type payment_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method payment_method NOT NULL,
  
  reference TEXT,
  description TEXT,
  
  -- Photo justificatif (espèces/chèque)
  photo_justificatif TEXT,
  
  receipt_url TEXT,
  is_validated BOOLEAN DEFAULT false,
  validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_read_auth" ON payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "payments_modify_auth" ON payments
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_payments_property ON payments(property_id);
CREATE INDEX idx_payments_owner ON payments(owner_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_type ON payments(payment_type);

-- ============================================
-- TABLE: contracts (contrats)
-- ============================================
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  
  contract_type contract_type NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  
  start_date DATE NOT NULL,
  end_date DATE,
  
  amount DECIMAL(12, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  
  terms TEXT,
  clauses TEXT,
  
  status contract_status DEFAULT 'brouillon',
  
  file_url TEXT,
  
  signed_at TIMESTAMPTZ,
  signed_by_owner BOOLEAN DEFAULT false,
  signed_by_tenant BOOLEAN DEFAULT false,
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contracts_read_auth" ON contracts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "contracts_modify_auth" ON contracts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_contracts_property ON contracts(property_id);
CREATE INDEX idx_contracts_type ON contracts(contract_type);
CREATE INDEX idx_contracts_status ON contracts(status);

-- ============================================
-- TABLE: documents (GED)
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  intervention_id UUID REFERENCES interventions(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('contrat', 'facture', 'recu', 'photo', 'video', 'plan', 'administratif', 'autre')),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_read_auth" ON documents
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "documents_modify_auth" ON documents
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_documents_type ON documents(type);

-- ============================================
-- TABLE: reports (rapports)
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  
  report_type report_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  total_expenses DECIMAL(12, 2) DEFAULT 0,
  net_income DECIMAL(12, 2) DEFAULT 0,
  
  file_url TEXT,
  
  generated_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_read_auth" ON reports
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "reports_modify_auth" ON reports
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_reports_owner ON reports(owner_id);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);

-- ============================================
-- TABLE: blog_posts
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  category TEXT,
  tags TEXT[],
  
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_read_public" ON blog_posts
  FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "blog_posts_modify_auth" ON blog_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);

-- ============================================
-- TABLE: faq_items
-- ============================================
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faq_items_read_public" ON faq_items
  FOR SELECT USING (active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "faq_items_modify_auth" ON faq_items
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_faq_items_category ON faq_items(category);
CREATE INDEX idx_faq_items_order ON faq_items(order_index);

-- ============================================
-- TABLE: notifications
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  
  read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_read_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================
-- FONCTIONS TRIGGER updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();