---
title: Module Réservations (Meublés)
status: done
priority: high
type: feature
tags: [bookings, reservations, calendar]
created_by: agent
created_at: 2026-07-07T13:30:31Z
position: 7
---

## Checklist
- [x] Page /bookings pour agents et secrétaires
- [x] Liste de toutes les réservations
- [x] Filtres (statut, recherche)
- [x] Statistiques (en attente, confirmées, terminées, annulées)
- [x] Actions : Confirmer acompte, Annuler, Terminer
- [x] Dialog détails avec infos client, bien, dates, montants
- [x] Badges statut (en attente, confirmée, en cours, à venir, terminée)
- [x] Formulaire déjà créé dans site public (public/properties/[id].tsx)

## Acceptance
- Secrétaire/Agent voit toutes les réservations
- Peut confirmer acompte → statut passe à confirmee
- Calcul automatique nuits et montant depuis site public
- Badges visuels selon dates réservées
- Secrétaire/Agent voit toutes les réservations
- Confirmation acompte change statut
- Réservations terminées après date fin