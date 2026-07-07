-- Script de génération de données de test complètes pour IMMO360

-- 1. CRÉER DES PROPRIÉTAIRES (mandants)
INSERT INTO profiles (id, email, first_name, last_name, phone, role, created_at)
SELECT 
  gen_random_uuid(),
  'owner' || n || '@test.com',
  CASE n 
    WHEN 1 THEN 'Amadou'
    WHEN 2 THEN 'Fatou'
    WHEN 3 THEN 'Moussa'
    WHEN 4 THEN 'Awa'
    WHEN 5 THEN 'Ibrahima'
  END,
  CASE n
    WHEN 1 THEN 'Diallo'
    WHEN 2 THEN 'Sow'
    WHEN 3 THEN 'Ndiaye'
    WHEN 4 THEN 'Ba'
    WHEN 5 THEN 'Kane'
  END,
  '+221 77 ' || LPAD((700 + n * 11)::text, 7, '0'),
  'owner',
  NOW() - (n || ' days')::interval
FROM generate_series(1, 5) AS n
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'owner' || n || '@test.com');

-- 2. CRÉER DES LOCATAIRES
INSERT INTO profiles (id, email, first_name, last_name, phone, role, created_at)
SELECT 
  gen_random_uuid(),
  'tenant' || n || '@test.com',
  CASE n 
    WHEN 1 THEN 'Cheikh'
    WHEN 2 THEN 'Mariama'
    WHEN 3 THEN 'Ousmane'
    WHEN 4 THEN 'Aissatou'
    WHEN 5 THEN 'Abdou'
  END,
  CASE n
    WHEN 1 THEN 'Fall'
    WHEN 2 THEN 'Thiam'
    WHEN 3 THEN 'Sarr'
    WHEN 4 THEN 'Diop'
    WHEN 5 THEN 'Cisse'
  END,
  '+221 76 ' || LPAD((500 + n * 13)::text, 7, '0'),
  'tenant',
  NOW() - (n * 2 || ' days')::interval
FROM generate_series(1, 5) AS n
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'tenant' || n || '@test.com');

-- 3. CRÉER DES PRESTATAIRES
INSERT INTO profiles (id, email, first_name, last_name, phone, role, company_name, created_at)
SELECT 
  gen_random_uuid(),
  'provider' || n || '@test.com',
  CASE n 
    WHEN 1 THEN 'Mamadou'
    WHEN 2 THEN 'Khady'
    WHEN 3 THEN 'Alioune'
  END,
  CASE n
    WHEN 1 THEN 'Gueye'
    WHEN 2 THEN 'Diouf'
    WHEN 3 THEN 'Mbaye'
  END,
  '+221 78 ' || LPAD((300 + n * 17)::text, 7, '0'),
  'provider',
  CASE n
    WHEN 1 THEN 'SénéBat Services'
    WHEN 2 THEN 'Dakar Plomberie'
    WHEN 3 THEN 'Teranga Électricité'
  END,
  NOW() - (n * 3 || ' days')::interval
FROM generate_series(1, 3) AS n
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'provider' || n || '@test.com');

-- 4. CRÉER 20 BIENS IMMOBILIERS
DO $$
DECLARE
  owner_ids uuid[];
  property_data RECORD;
BEGIN
  -- Récupérer les IDs des propriétaires
  SELECT ARRAY_AGG(id) INTO owner_ids FROM profiles WHERE role = 'owner' LIMIT 5;
  
  IF array_length(owner_ids, 1) >= 5 THEN
    -- Insérer les biens
    FOR property_data IN 
      SELECT 
        n,
        owner_ids[1 + (n % 5)] AS owner_id,
        CASE (n % 7)
          WHEN 0 THEN 'appartement'
          WHEN 1 THEN 'villa'
          WHEN 2 THEN 'maison'
          WHEN 3 THEN 'terrain'
          WHEN 4 THEN 'bureau'
          WHEN 5 THEN 'commerce'
          WHEN 6 THEN 'immeuble'
        END AS ptype,
        CASE (n % 4)
          WHEN 0 THEN 'disponible'
          WHEN 1 THEN 'loue'
          WHEN 2 THEN 'reserve'
          WHEN 3 THEN 'disponible'
        END AS pstatus,
        CASE (n % 2) WHEN 0 THEN 'location' ELSE 'vente' END AS trans_type,
        CASE (n % 10)
          WHEN 0 THEN 'Dakar'
          WHEN 1 THEN 'Almadies'
          WHEN 2 THEN 'Mermoz'
          WHEN 3 THEN 'Plateau'
          WHEN 4 THEN 'Yoff'
          WHEN 5 THEN 'Ouakam'
          WHEN 6 THEN 'Thiès'
          WHEN 7 THEN 'Saly'
          WHEN 8 THEN 'Rufisque'
          WHEN 9 THEN 'Guédiawaye'
        END AS city,
        2 + (n % 5) AS rooms,
        50 + (n * 15) AS surface,
        CASE WHEN (n % 2 = 0) THEN 250000 + (n * 50000) ELSE 15000000 + (n * 5000000) END AS price
      FROM generate_series(1, 20) AS n
    LOOP
      INSERT INTO properties (
        reference, owner_id, property_type, status, transaction_type,
        title, address, city, commune, neighborhood,
        rooms, surface_area, price, description, amenities,
        photos, published, created_at
      ) VALUES (
        'PROP-' || LPAD(property_data.n::text, 4, '0'),
        property_data.owner_id,
        property_data.ptype,
        property_data.pstatus,
        property_data.trans_type,
        CASE property_data.ptype
          WHEN 'appartement' THEN 'Appartement moderne ' || property_data.rooms || ' pièces'
          WHEN 'villa' THEN 'Villa standing avec piscine'
          WHEN 'maison' THEN 'Maison familiale ' || property_data.city
          WHEN 'terrain' THEN 'Terrain constructible ' || property_data.surface || 'm²'
          WHEN 'bureau' THEN 'Bureau équipé ' || property_data.city
          WHEN 'commerce' THEN 'Local commercial ' || property_data.city
          ELSE 'Immeuble rapport'
        END,
        CASE (property_data.n % 5)
          WHEN 0 THEN 'Rue 10 x Corniche'
          WHEN 1 THEN 'Boulevard de la République'
          WHEN 2 THEN 'Avenue Cheikh Anta Diop'
          WHEN 3 THEN 'Rue Carnot'
          WHEN 4 THEN 'Route de l''Aéroport'
        END,
        property_data.city,
        CASE (property_data.n % 3)
          WHEN 0 THEN 'Dakar'
          WHEN 1 THEN 'Thiès'
          WHEN 2 THEN 'Mbour'
        END,
        CASE (property_data.n % 4)
          WHEN 0 THEN 'Almadies'
          WHEN 1 THEN 'Fann'
          WHEN 2 THEN 'Point E'
          WHEN 3 THEN 'Sacré-Coeur'
        END,
        property_data.rooms,
        property_data.surface,
        property_data.price,
        'Bien immobilier de qualité situé dans un quartier recherché. ' ||
        CASE property_data.ptype
          WHEN 'appartement' THEN 'Immeuble sécurisé avec gardien 24/7. Proche commodités.'
          WHEN 'villa' THEN 'Jardin paysager, garage double, cuisine équipée.'
          WHEN 'maison' THEN 'Construction récente, bon état général.'
          ELSE 'Emplacement stratégique, excellent investissement.'
        END,
        ARRAY['Climatisation', 'Eau courante', 'Électricité', 'Parking', 'Sécurité']::text[],
        CASE 
          WHEN property_data.n <= 6 THEN ARRAY['/generated/property-' || property_data.n || '.png']::text[]
          ELSE ARRAY[]::text[]
        END,
        (property_data.n % 3 != 0),
        NOW() - (property_data.n || ' days')::interval
      )
      ON CONFLICT (reference) DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- 5. CRÉER DES PROSPECTS
DO $$
DECLARE
  property_ids uuid[];
BEGIN
  SELECT ARRAY_AGG(id) INTO property_ids FROM properties LIMIT 10;
  
  IF array_length(property_ids, 1) > 0 THEN
    INSERT INTO prospects (first_name, last_name, email, phone, property_id, demand_type, status, notes, created_at)
    SELECT 
      CASE n 
        WHEN 1 THEN 'Seydou' WHEN 2 THEN 'Binta' WHEN 3 THEN 'Modou'
        WHEN 4 THEN 'Coumba' WHEN 5 THEN 'Babacar' WHEN 6 THEN 'Ndeye'
        WHEN 7 THEN 'Lamine' WHEN 8 THEN 'Rokhaya' WHEN 9 THEN 'Souleymane' WHEN 10 THEN 'Astou'
      END,
      CASE n
        WHEN 1 THEN 'Sy' WHEN 2 THEN 'Touré' WHEN 3 THEN 'Faye'
        WHEN 4 THEN 'Seck' WHEN 5 THEN 'Dieng' WHEN 6 THEN 'Badiane'
        WHEN 7 THEN 'Camara' WHEN 8 THEN 'Sène' WHEN 9 THEN 'Samb' WHEN 10 THEN 'Niang'
      END,
      'prospect' || n || '@example.com',
      '+221 70 ' || LPAD((100 + n * 19)::text, 7, '0'),
      property_ids[1 + (n % array_length(property_ids, 1))],
      CASE (n % 3) WHEN 0 THEN 'visite' WHEN 1 THEN 'information' ELSE 'reservation' END,
      CASE (n % 4) WHEN 0 THEN 'nouveau' WHEN 1 THEN 'qualifie' WHEN 2 THEN 'negocie' ELSE 'converti' END,
      'Prospect intéressé par ' || CASE (n % 2) WHEN 0 THEN 'location' ELSE 'achat' END,
      NOW() - (n || ' days')::interval
    FROM generate_series(1, 10) AS n
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 6. CRÉER DES VISITES
DO $$
DECLARE
  property_ids uuid[];
  prospect_record RECORD;
BEGIN
  SELECT ARRAY_AGG(id) INTO property_ids FROM properties WHERE published = true LIMIT 5;
  
  IF array_length(property_ids, 1) > 0 THEN
    FOR prospect_record IN 
      SELECT id, first_name, last_name, phone FROM prospects LIMIT 8
    LOOP
      INSERT INTO visits (
        property_id, visitor_name, visitor_phone, visitor_email,
        visit_date, visit_time, status, notes, created_at
      ) VALUES (
        property_ids[1 + (floor(random() * array_length(property_ids, 1)))::int],
        prospect_record.first_name || ' ' || prospect_record.last_name,
        prospect_record.phone,
        LOWER(prospect_record.first_name) || '.' || LOWER(prospect_record.last_name) || '@example.com',
        CURRENT_DATE + (floor(random() * 14) || ' days')::interval,
        ('10:00'::time + (floor(random() * 8) || ' hours')::interval),
        CASE (floor(random() * 3))::int 
          WHEN 0 THEN 'en_attente'
          WHEN 1 THEN 'confirmee'
          ELSE 'terminee'
        END,
        'Visite programmée',
        NOW() - (floor(random() * 10) || ' days')::interval
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- 7. CRÉER DES RÉSERVATIONS
DO $$
DECLARE
  property_ids uuid[];
BEGIN
  SELECT ARRAY_AGG(id) INTO property_ids FROM properties WHERE transaction_type = 'location' AND published = true LIMIT 3;
  
  IF array_length(property_ids, 1) > 0 THEN
    INSERT INTO bookings (
      property_id, client_name, client_phone, client_email,
      start_date, end_date, total_amount, deposit_paid, status, created_at
    )
    SELECT 
      property_ids[1 + (n % array_length(property_ids, 1))],
      CASE n WHEN 1 THEN 'Jean Dupont' WHEN 2 THEN 'Marie Martin' WHEN 3 THEN 'Pierre Durand' WHEN 4 THEN 'Sophie Bernard' ELSE 'Luc Petit' END,
      '+33 6 ' || LPAD((12345678 + n)::text, 8, '0'),
      'client' || n || '@example.fr',
      CURRENT_DATE + (7 + n * 3 || ' days')::interval,
      CURRENT_DATE + (14 + n * 3 || ' days')::interval,
      350000 + (n * 50000),
      true,
      CASE (n % 3) WHEN 0 THEN 'en_attente' WHEN 1 THEN 'confirmee' ELSE 'terminee' END,
      NOW() - (n * 2 || ' days')::interval
    FROM generate_series(1, 5) AS n
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 8. CRÉER DES INTERVENTIONS
DO $$
DECLARE
  property_ids uuid[];
  provider_ids uuid[];
BEGIN
  SELECT ARRAY_AGG(id) INTO property_ids FROM properties LIMIT 8;
  SELECT ARRAY_AGG(id) INTO provider_ids FROM profiles WHERE role = 'provider';
  
  IF array_length(property_ids, 1) > 0 AND array_length(provider_ids, 1) > 0 THEN
    INSERT INTO interventions (
      property_id, provider_id, intervention_type, description,
      scheduled_date, estimated_cost, actual_cost, status,
      photos_before, photos_after, provider_comment, created_at
    )
    SELECT 
      property_ids[1 + (n % array_length(property_ids, 1))],
      provider_ids[1 + (n % array_length(provider_ids, 1))],
      CASE (n % 5) 
        WHEN 0 THEN 'plomberie'
        WHEN 1 THEN 'peinture'
        WHEN 2 THEN 'climatisation'
        WHEN 3 THEN 'maconnerie'
        ELSE 'nettoyage'
      END,
      CASE (n % 5)
        WHEN 0 THEN 'Réparation fuite salle de bain'
        WHEN 1 THEN 'Rafraîchissement peinture intérieure'
        WHEN 2 THEN 'Installation climatiseur split'
        WHEN 3 THEN 'Réfection sol terrasse'
        ELSE 'Nettoyage complet après départ locataire'
      END,
      CURRENT_DATE - (10 - n || ' days')::interval,
      50000 + (n * 25000),
      CASE WHEN n % 2 = 0 THEN 50000 + (n * 25000) ELSE NULL END,
      CASE (n % 3) 
        WHEN 0 THEN 'planifiee'
        WHEN 1 THEN 'en_cours'
        ELSE 'terminee'
      END,
      CASE WHEN n % 2 = 0 THEN ARRAY[]::text[] ELSE NULL END,
      CASE WHEN n % 2 = 0 THEN ARRAY[]::text[] ELSE NULL END,
      CASE WHEN n % 2 = 0 THEN 'Travaux réalisés selon devis' ELSE NULL END,
      NOW() - (n * 3 || ' days')::interval
    FROM generate_series(1, 10) AS n
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 9. CRÉER DES PAIEMENTS
DO $$
DECLARE
  property_ids uuid[];
  tenant_ids uuid[];
  owner_ids uuid[];
BEGIN
  SELECT ARRAY_AGG(id) INTO property_ids FROM properties LIMIT 10;
  SELECT ARRAY_AGG(id) INTO tenant_ids FROM profiles WHERE role = 'tenant';
  SELECT ARRAY_AGG(id) INTO owner_ids FROM profiles WHERE role = 'owner';
  
  IF array_length(property_ids, 1) > 0 AND array_length(tenant_ids, 1) > 0 THEN
    INSERT INTO payments (
      property_id, tenant_id, owner_id, payment_type, payment_method,
      amount, payment_date, description, is_validated, created_at
    )
    SELECT 
      property_ids[1 + (n % array_length(property_ids, 1))],
      tenant_ids[1 + (n % array_length(tenant_ids, 1))],
      owner_ids[1 + (n % array_length(owner_ids, 1))],
      CASE (n % 5) 
        WHEN 0 THEN 'loyer'
        WHEN 1 THEN 'acompte'
        WHEN 2 THEN 'caution'
        WHEN 3 THEN 'frais'
        ELSE 'reservation'
      END,
      CASE (n % 5)
        WHEN 0 THEN 'mobile_money'
        WHEN 1 THEN 'virement'
        WHEN 2 THEN 'especes'
        WHEN 3 THEN 'cheque'
        ELSE 'carte'
      END,
      200000 + (n * 50000),
      CURRENT_DATE - (n || ' days')::interval,
      'Paiement mois de ' || TO_CHAR(CURRENT_DATE - (n || ' days')::interval, 'TMMonth YYYY'),
      (n % 3 != 0),
      NOW() - (n || ' days')::interval
    FROM generate_series(1, 15) AS n
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 10. CRÉER DES CONTRATS
DO $$
DECLARE
  property_ids uuid[];
  owner_ids uuid[];
  tenant_ids uuid[];
BEGIN
  SELECT ARRAY_AGG(id) INTO property_ids FROM properties WHERE status = 'loue' LIMIT 5;
  SELECT ARRAY_AGG(id) INTO owner_ids FROM profiles WHERE role = 'owner';
  SELECT ARRAY_AGG(id) INTO tenant_ids FROM profiles WHERE role = 'tenant';
  
  IF array_length(property_ids, 1) > 0 AND array_length(owner_ids, 1) > 0 AND array_length(tenant_ids, 1) > 0 THEN
    INSERT INTO contracts (
      reference, property_id, owner_id, tenant_id, contract_type,
      start_date, end_date, amount, deposit_amount, terms, status,
      signed_by_owner, signed_by_tenant, created_at
    )
    SELECT 
      'CTR-' || LPAD(n::text, 4, '0'),
      property_ids[1 + ((n - 1) % array_length(property_ids, 1))],
      owner_ids[1 + ((n - 1) % array_length(owner_ids, 1))],
      tenant_ids[1 + ((n - 1) % array_length(tenant_ids, 1))],
      'location',
      CURRENT_DATE - (180 - n * 30 || ' days')::interval,
      CURRENT_DATE + (180 + n * 30 || ' days')::interval,
      250000 + (n * 50000),
      500000 + (n * 100000),
      'Paiement mensuel à terme échu. Charges non comprises. Préavis de 3 mois.',
      CASE (n % 3) WHEN 0 THEN 'brouillon' WHEN 1 THEN 'en_cours' ELSE 'termine' END,
      (n % 3 != 0),
      (n % 3 != 0),
      NOW() - (n * 10 || ' days')::interval
    FROM generate_series(1, 5) AS n
    ON CONFLICT (reference) DO NOTHING;
  END IF;
END $$;

-- 11. CRÉER DES RAPPORTS
DO $$
DECLARE
  owner_ids uuid[];
BEGIN
  SELECT ARRAY_AGG(id) INTO owner_ids FROM profiles WHERE role = 'owner' LIMIT 5;
  
  IF array_length(owner_ids, 1) > 0 THEN
    INSERT INTO reports (
      owner_id, report_type, period_start, period_end,
      total_revenue, total_expenses, net_income, sent_to_owner, created_at
    )
    SELECT 
      owner_ids[1 + ((n - 1) % array_length(owner_ids, 1))],
      CASE (n % 4) WHEN 0 THEN 'mensuel' WHEN 1 THEN 'trimestriel' WHEN 2 THEN 'semestriel' ELSE 'annuel' END,
      DATE_TRUNC('month', CURRENT_DATE - (n * 30 || ' days')::interval),
      DATE_TRUNC('month', CURRENT_DATE - ((n - 1) * 30 || ' days')::interval) - interval '1 day',
      1500000 + (n * 250000),
      450000 + (n * 75000),
      1050000 + (n * 175000),
      (n % 2 = 0),
      NOW() - (n * 5 || ' days')::interval
    FROM generate_series(1, 5) AS n
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 12. CRÉER DES ARTICLES BLOG
INSERT INTO blog_posts (title, slug, excerpt, content, category, cover_image_url, published, published_at, created_at)
VALUES
  (
    'Guide complet de la location immobilière à Dakar',
    'guide-location-dakar',
    'Tout ce qu''il faut savoir avant de louer un bien immobilier dans la capitale sénégalaise.',
    E'# Guide complet de la location immobilière à Dakar\n\nLa recherche d''un logement à Dakar peut s''avérer complexe. Voici nos conseils...\n\n## Les quartiers prisés\n\n- **Almadies**: Zone résidentielle haut de gamme\n- **Plateau**: Centre d''affaires\n- **Mermoz**: Quartier familial calme\n\n## Budget à prévoir\n\nComptez entre 200 000 et 500 000 FCFA par mois pour un appartement 2-3 pièces selon le quartier.',
    'conseils',
    '',
    true,
    NOW() - interval '5 days',
    NOW() - interval '5 days'
  ),
  (
    'Investir dans l''immobilier au Sénégal : Opportunités 2026',
    'investir-immobilier-senegal-2026',
    'Les meilleures opportunités d''investissement immobilier au Sénégal cette année.',
    E'# Investir dans l''immobilier au Sénégal\n\nLe marché immobilier sénégalais offre de belles opportunités...\n\n## Zones en développement\n\n- Diamniadio\n- Lac Rose\n- Route de Rufisque',
    'actualites',
    '',
    true,
    NOW() - interval '10 days',
    NOW() - interval '10 days'
  ),
  (
    'Comment calculer la rentabilité d''un bien locatif',
    'calculer-rentabilite-bien-locatif',
    'Méthode simple pour évaluer la rentabilité d''un investissement locatif.',
    E'# Calculer la rentabilité locative\n\nAvant d''investir, il est crucial de calculer la rentabilité...\n\n## Formule de base\n\nRentabilité brute = (Loyer annuel / Prix d''achat) × 100',
    'guides',
    '',
    true,
    NOW() - interval '15 days',
    NOW() - interval '15 days'
  ),
  (
    'Les erreurs à éviter lors d''un achat immobilier',
    'erreurs-achat-immobilier',
    '10 erreurs courantes à ne pas commettre lors de l''acquisition d''un bien.',
    E'# Erreurs courantes en achat immobilier\n\n1. Ne pas vérifier les documents administratifs\n2. Négliger l''état du bien\n3. Sous-estimer les frais annexes',
    'conseils',
    '',
    true,
    NOW() - interval '20 days',
    NOW() - interval '20 days'
  ),
  (
    'Tendances du marché immobilier sénégalais',
    'tendances-marche-immobilier-senegal',
    'Analyse des tendances et prévisions pour le secteur immobilier au Sénégal.',
    E'# Marché immobilier 2026\n\nLe secteur poursuit sa croissance avec une hausse de 12% des transactions...',
    'actualites',
    '',
    true,
    NOW() - interval '3 days',
    NOW() - interval '3 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- 13. CRÉER DES QUESTIONS FAQ
INSERT INTO faq_items (question, answer, category, order_index, is_active, created_at)
VALUES
  ('Comment louer un bien sur IMMO360 ?', 
   'Pour louer un bien, parcourez notre catalogue en ligne, sélectionnez le bien qui vous intéresse et cliquez sur "Demander une visite". Notre équipe vous contactera rapidement pour organiser la visite.',
   'general', 1, true, NOW()),
  
  ('Quels documents sont nécessaires pour une location ?',
   'Documents requis : pièce d''identité, justificatif de revenus (3 dernières fiches de paie), justificatif de domicile, garant si nécessaire.',
   'location', 2, true, NOW()),
   
  ('Comment se passe le processus d''achat ?',
   'Après avoir trouvé votre bien, nous vous accompagnons dans toutes les démarches : vérification des documents, négociation du prix, signature du compromis, puis acte authentique chez le notaire.',
   'vente', 3, true, NOW()),
   
  ('Quels sont les modes de paiement acceptés ?',
   'Nous acceptons les paiements par virement bancaire, Mobile Money (Orange Money, Wave), chèque et espèces pour les acomptes.',
   'paiements', 4, true, NOW()),
   
  ('Proposez-vous des biens meublés ?',
   'Oui, nous proposons des résidences meublées pour des locations courte et moyenne durée, idéales pour les expatriés et touristes.',
   'general', 5, true, NOW()),
   
  ('Y a-t-il des frais d''agence ?',
   'Les frais d''agence représentent généralement un mois de loyer pour les locations, et 3% du prix de vente pour les achats. Ils couvrent notre accompagnement complet.',
   'general', 6, true, NOW()),
   
  ('Puis-je visiter plusieurs biens le même jour ?',
   'Absolument ! Nous organisons des tournées de visites pour vous faire gagner du temps. Contactez-nous pour planifier.',
   'location', 7, true, NOW()),
   
  ('Quel est le délai de préavis pour quitter un logement ?',
   'Le préavis standard est de 3 mois pour une location vide, et 1 mois pour une location meublée, sauf clause contraire au contrat.',
   'location', 8, true, NOW()),
   
  ('Proposez-vous un service de gestion locative ?',
   'Oui, IMMO360 propose un service complet de gestion locative : recherche de locataires, encaissement des loyers, gestion des réparations, rapports mensuels.',
   'general', 9, true, NOW()),
   
  ('Comment obtenir une estimation de mon bien ?',
   'Demandez une estimation gratuite via notre formulaire en ligne ou contactez-nous directement. Un agent visitera votre bien sous 48h.',
   'vente', 10, true, NOW())
ON CONFLICT DO NOTHING;

COMMIT;
