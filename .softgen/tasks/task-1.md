---
title: Nouvelle Architecture Database Complète
status: in_progress
priority: urgent
type: chore
tags: [database, migration, architecture]
created_by: agent
created_at: 2026-07-07T13:30:25Z
position: 1
---

## Notes
Refonte complète de la structure database selon le nouveau cahier des charges. Suppression de l'ancienne structure et création d'un schéma complet couvrant tous les modules demandés.

## Checklist
- [ ] Supprimer toutes les anciennes tables
- [ ] Créer table users avec 6 rôles (admin, agent, secretary, accountant, provider, owner)
- [ ] Créer table properties (biens) avec tous les champs (GPS, vidéos, statut étendu)
- [ ] Créer table owners (propriétaires/mandants)
- [ ] Créer table tenants (locataires)
- [ ] Créer table prospects avec type_demande
- [ ] Créer table visits (demandes de visite)
- [ ] Créer table bookings (réservations avec dates, acompte)
- [ ] Créer table interventions avec photos avant/après
- [ ] Créer table providers (prestataires)
- [ ] Créer table payments avec photo_justificatif
- [ ] Créer table documents (bibliothèque par bien)
- [ ] Créer table contracts (contrats)
- [ ] Créer table reports (rapports automatisés)
- [ ] Créer table blog_posts (articles)
- [ ] Créer table faq_items (FAQ)
- [ ] Créer table notifications
- [ ] Configurer RLS pour chaque profil utilisateur
- [ ] Régénérer les types TypeScript

## Acceptance
- La nouvelle DB couvre tous les modules du cahier des charges
- Chaque profil utilisateur a ses permissions RLS
- Les types TypeScript sont à jour