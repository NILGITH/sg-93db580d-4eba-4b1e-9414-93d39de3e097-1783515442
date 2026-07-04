---
title: Compléter schéma DB - Tables métier
status: done
priority: urgent
type: feature
tags: [database, schema]
created_by: agent
created_at: 2026-07-04T12:47:00Z
position: 6
---

## Notes
Ajouter toutes les tables manquantes pour un ERP immobilier complet : locataires, prestataires, interventions, paiements, documents, prospects, rapports, blog.

## Checklist
- [ ] Table tenants (locataires avec contrats)
- [ ] Table contractors (prestataires)
- [ ] Table interventions (missions/travaux)
- [ ] Table payments (encaissements multi-méthodes)
- [ ] Table documents (GED versionnée)
- [ ] Table prospects (CRM pipeline)
- [ ] Table reports (rapports automatiques)
- [ ] Table blog_posts et faq_items
- [ ] Table notifications
- [ ] RLS policies pour toutes les tables

## Acceptance
- Schéma complet avec isolation multi-agences
- Toutes les relations FK correctes
- RLS sur toutes les tables