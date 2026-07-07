-- ÉTAPE 4: Créer la table visit_bookings pour les réservations
CREATE TABLE IF NOT EXISTS visit_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  visitor_name VARCHAR(255) NOT NULL,
  visitor_email VARCHAR(255) NOT NULL,
  visitor_phone VARCHAR(50),
  preferred_date TIMESTAMP NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_visit_bookings_property ON visit_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_visit_bookings_status ON visit_bookings(status);
CREATE INDEX IF NOT EXISTS idx_visit_bookings_date ON visit_bookings(preferred_date);

-- Vérifier
SELECT COUNT(*) as total_bookings FROM visit_bookings;