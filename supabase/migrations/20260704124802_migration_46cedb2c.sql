-- RLS Policies pour les nouvelles tables

-- TENANTS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_same_agency" ON tenants
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- CONTRACTORS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contractors_same_agency" ON contractors
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- INTERVENTIONS
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interventions_same_agency" ON interventions
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "contractors_own_interventions" ON interventions
  FOR SELECT USING (
    contractor_id IN (
      SELECT id FROM contractors WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- DOCUMENTS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_same_agency" ON documents
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- PROSPECTS
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prospects_same_agency" ON prospects
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- REPORTS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_same_agency" ON reports
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "owner_own_reports" ON reports
  FOR SELECT USING (
    owner_id = auth.uid()
  );

-- BLOG_POSTS (public read)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "blog_agency_manage" ON blog_posts
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- FAQ_ITEMS (public read)
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faq_public_read" ON faq_items
  FOR SELECT USING (active = true);

CREATE POLICY "faq_agency_manage" ON faq_items
  FOR ALL USING (
    agency_id IN (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (
    user_id = auth.uid()
  );