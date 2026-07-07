-- Créer les buckets pour Supabase Storage

-- Bucket pour les photos de biens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('properties', 'properties', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les interventions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('interventions', 'interventions', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les justificatifs de paiement
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payments', 'payments', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les contrats
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour le blog
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour properties
CREATE POLICY "Tout le monde peut voir les images de biens"
ON storage.objects FOR SELECT
USING (bucket_id = 'properties');

CREATE POLICY "Agents et admins peuvent uploader des images de biens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'properties' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'agent')
  )
);

CREATE POLICY "Agents et admins peuvent supprimer des images de biens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'properties' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'agent')
  )
);

-- Policies pour documents
CREATE POLICY "Authentifiés peuvent voir les documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Agents et secrétaires peuvent uploader des documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'agent', 'secretary')
  )
);

-- Policies pour interventions
CREATE POLICY "Authentifiés peuvent voir les photos d'interventions"
ON storage.objects FOR SELECT
USING (bucket_id = 'interventions' AND auth.role() = 'authenticated');

CREATE POLICY "Prestataires et agents peuvent uploader des photos d'interventions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'interventions' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'agent', 'provider')
  )
);

-- Policies pour payments
CREATE POLICY "Comptables et admins peuvent voir les justificatifs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payments' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'accountant')
  )
);

CREATE POLICY "Comptables et admins peuvent uploader des justificatifs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payments' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'accountant')
  )
);

-- Policies pour contracts
CREATE POLICY "Authentifiés peuvent voir les contrats"
ON storage.objects FOR SELECT
USING (bucket_id = 'contracts' AND auth.role() = 'authenticated');

CREATE POLICY "Agents et secrétaires peuvent uploader des contrats"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contracts' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'agent', 'secretary')
  )
);

-- Policies pour blog
CREATE POLICY "Tout le monde peut voir les images du blog"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

CREATE POLICY "Admins et agents peuvent uploader des images de blog"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'agent')
  )
);
