---
title: Nouvelle Architecture Database Complète
status: done
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
- [x] Supprimer toutes les anciennes tables
- [x] Créer table users avec 6 rôles (admin, agent, secretary, accountant, provider, owner)
- [x] Créer table properties (biens) avec tous les champs (GPS, vidéos, statut étendu)
- [x] Créer table owners (propriétaires/mandants)
- [x] Créer table tenants (locataires)
- [x] Créer table prospects avec type_demande
- [x] Créer table visits (demandes de visite)
- [x] Créer table bookings (réservations avec dates, acompte)
- [x] Créer table interventions avec photos avant/après
- [x] Créer table providers (prestataires)
- [x] Créer table payments avec photo_justificatif
- [x] Créer table documents (bibliothèque par bien)
- [x] Créer table contracts (contrats)
- [x] Créer table reports (rapports automatisés)
- [x] Créer table blog_posts (articles)
- [x] Créer table faq_items (FAQ)
- [x] Créer table notifications
- [x] Configurer RLS pour chaque profil utilisateur
- [x] Régénérer les types TypeScript

## Acceptance
- La nouvelle DB couvre tous les modules du cahier des charges
- Chaque profil utilisateur a ses permissions RLS
- Les types TypeScript sont à jour