---
title: Simplifier architecture - Application unique
status: done
priority: urgent
type: chore
tags: [architecture, refactor, simplification]
created_by: agent
created_at: 2026-07-05T19:15:00Z
position: 17
---

## Notes
Transformer IMMO360 de SaaS multi-agences vers application unique pour UNE agence immobilière.

Objectif : Site web premium avec :
- Vitrine professionnelle
- Catalogue biens avec réservation visites
- Administration simplifiée
- Gestion immobilière interne

## Checklist
- [x] Supprimer champ agency_id des tables (utiliser une seule agence implicite)
- [x] Simplifier les rôles (retirer super_admin, admin_agency → admin)
- [x] Retirer la table agencies de la navigation
- [x] Simplifier le formulaire d'inscription (pas de sélection d'agence)
- [x] Améliorer le site public avec réservation de visites
- [x] Simplifier l'administration (retirer /admin/agencies)
- [x] Mettre à jour le project.md

## Acceptance
- ✅ Une seule agence implicite "IMMO360"
- ✅ Inscription simplifiée (pas de choix d'agence)
- ✅ Site public avec réservation fonctionnelle (table visit_bookings créée)
- ✅ RLS policies recréées sans récursion
- ✅ Types Supabase régénérés
- ✅ Toutes les pages admin corrigées (admin au lieu de super_admin)