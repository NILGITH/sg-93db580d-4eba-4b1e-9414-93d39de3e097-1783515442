-- Types enum pour le système
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin_agence',
  'comptable',
  'commercial',
  'secretaire',
  'proprietaire'
);

CREATE TYPE property_status AS ENUM (
  'disponible',
  'loue',
  'vendu',
  'travaux',
  'reserve'
);

CREATE TYPE property_type AS ENUM (
  'appartement',
  'maison',
  'studio',
  'duplex',
  'villa',
  'terrain',
  'commerce',
  'bureau'
);

CREATE TYPE mandate_type AS ENUM (
  'gestion',
  'location',
  'vente',
  'gestion_complete'
);

CREATE TYPE payment_method AS ENUM (
  'mobile_money',
  'carte_bancaire',
  'virement',
  'cheque',
  'especes'
);

-- Table agencies (agences immobilières)
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  siret TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Modifier la table profiles existante pour ajouter les champs nécessaires
ALTER TABLE profiles 
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS full_name,
  DROP COLUMN IF EXISTS avatar_url;

ALTER TABLE profiles
  ADD COLUMN agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  ADD COLUMN role user_role NOT NULL DEFAULT 'commercial',
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Table owners (propriétaires)
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table properties (biens immobiliers)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  status property_status DEFAULT 'disponible',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  surface_area DECIMAL(10,2),
  rooms INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor INTEGER,
  price DECIMAL(12,2),
  rental_price DECIMAL(10,2),
  charges DECIMAL(10,2),
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, reference)
);

-- Table mandates (mandats)
CREATE TABLE mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  mandate_type mandate_type NOT NULL,
  reference TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  commission_rate DECIMAL(5,2),
  commission_amount DECIMAL(10,2),
  terms TEXT,
  documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, reference)
);

-- Table payments (paiements)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  mandate_id UUID REFERENCES mandates(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method payment_method NOT NULL,
  reference TEXT,
  description TEXT,
  receipt_url TEXT,
  is_validated BOOLEAN DEFAULT false,
  validated_by UUID REFERENCES profiles(id),
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_profiles_agency ON profiles(agency_id);
CREATE INDEX idx_profiles_user ON profiles(id);
CREATE INDEX idx_owners_agency ON owners(agency_id);
CREATE INDEX idx_owners_user ON owners(user_id);
CREATE INDEX idx_properties_agency ON properties(agency_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_mandates_agency ON mandates(agency_id);
CREATE INDEX idx_mandates_property ON mandates(property_id);
CREATE INDEX idx_payments_agency ON payments(agency_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER owners_updated_at BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mandates_updated_at BEFORE UPDATE ON mandates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();