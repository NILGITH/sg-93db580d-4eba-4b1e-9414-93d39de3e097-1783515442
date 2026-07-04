---
title: Schema de base de données multi-agences MVP
status: done
priority: urgent
type: feature
tags: [database, schema, rbac, multi-tenant]
created_by: agent
created_at: 2026-07-04T12:36:30Z
position: 1
---

## Notes
Créer le schéma PostgreSQL pour le MVP IMMO360 avec isolation stricte multi-agences. Chaque table doit avoir RLS activé. Structure : agences → users → biens/mandats/propriétaires.

## Checklist
- [x] Table agencies (nom, siret, adresse, contact, créé_le, actif)
- [x] Table profiles (user_id FK auth.users, agency_id FK, role enum, prénom, nom, téléphone)
- [x] Table properties (bien : agency_id FK, adresse, type, surface, chambres, statut, prix, photos[], créé_le)
- [x] Table mandates (mandat : agency_id FK, property_id FK, owner_id FK, type, date_début, date_fin, honoraires, documents[])
- [x] Table owners (propriétaire : agency_id FK, prénom, nom, email, téléphone, user_id FK optionnel pour portail)
- [x] Table payments (paiement : agency_id FK, property_id FK, montant, date, mode, référence, justificatif_url)
- [x] RLS policies strictes (chaque agence voit uniquement ses données)
- [x] Trigger auto-création profile après signup
- [x] Types enum (role, property_status, mandate_type, payment_method)

## Acceptance
- Schéma complet sans erreur, types générés, RLS activé partout
- Un utilisateur d'une agence A ne peut pas voir les données d'une agence B
- Création automatique du profile lors de l'inscription