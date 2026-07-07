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
- [ ] Supprimer champ agency_id des tables (utiliser une seule agence implicite)
- [ ] Simplifier les rôles (retirer super_admin, admin_agency → admin)
- [ ] Retirer la table agencies de la navigation
- [ ] Simplifier le formulaire d'inscription (pas de sélection d'agence)
- [ ] Améliorer le site public avec réservation de visites
- [ ] Simplifier l'administration (retirer /admin/agencies)
- [ ] Mettre à jour le project.md

## Acceptance
- Une seule agence implicite
- Inscription simplifiée (pas de choix d'agence)
- Site public avec réservation fonctionnelle