-- Tables manquantes uniquement (payments existe déjà)

-- LOCATAIRES (tenants)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PRESTATAIRES (contractors)
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL CHECK (specialty IN ('plombier', 'electricien', 'macon', 'peintre', 'jardinier', 'serrurier', 'chauffagiste', 'autre')),
  siret TEXT,
  address TEXT,
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INTERVENTIONS (missions/travaux)
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'validated', 'cancelled')),
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES profiles(id),
  validated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- DOCUMENTS (GED versionnée)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  mandate_id UUID REFERENCES mandates(id) ON DELETE CASCADE,
  intervention_id UUID REFERENCES interventions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('contrat', 'facture', 'recu', 'photo', 'video', 'plan', 'administratif', 'juridique', 'rapport', 'autre')),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PROSPECTS (CRM)
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT CHECK (source IN ('website', 'referral', 'direct', 'social_media', 'advertising', 'other')),
  interest_type TEXT CHECK (interest_type IN ('achat', 'location', 'vente', 'gestion')),
  budget DECIMAL(10, 2),
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'contact', 'visite', 'negociation', 'reservation', 'signature', 'client', 'perdu')),
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT,
  last_contact_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RAPPORTS (reports)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mensuel', 'trimestriel', 'semestriel', 'annuel', 'ponctuel')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  total_expenses DECIMAL(10, 2) DEFAULT 0,
  net_income DECIMAL(10, 2) DEFAULT 0,
  file_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BLOG
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mission', 'paiement', 'rapport', 'rendez_vous', 'echeance', 'relance', 'validation')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  sent_via TEXT[] DEFAULT ARRAY['app'],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Triggers updated_at
CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER interventions_updated_at BEFORE UPDATE ON interventions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER faq_items_updated_at BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX idx_tenants_agency ON tenants(agency_id);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_contractors_agency ON contractors(agency_id);
CREATE INDEX idx_interventions_agency ON interventions(agency_id);
CREATE INDEX idx_interventions_property ON interventions(property_id);
CREATE INDEX idx_documents_agency ON documents(agency_id);
CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_prospects_agency ON prospects(agency_id);
CREATE INDEX idx_reports_agency ON reports(agency_id);
CREATE INDEX idx_reports_owner ON reports(owner_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);