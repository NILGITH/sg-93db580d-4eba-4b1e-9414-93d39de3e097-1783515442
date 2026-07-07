---
title: Kkiapay Payment Integration (Sandbox)
status: in_progress
priority: high
type: feature
tags: [payment, kkiapay, integration, sandbox]
created_by: agent
created_at: 2026-07-07T16:05:01Z
position: 19
---

## Notes
Intégrer Kkiapay en mode sandbox pour les paiements en ligne (réservations, acomptes, loyers). Utiliser les clés API sandbox disponibles.

## Checklist
- [x] Installer SDK Kkiapay
- [x] Configurer clés API sandbox dans .env
- [x] Créer service kkiapay.ts
- [x] Créer composant KkiapayButton
- [x] API route pour vérification transactions
- [ ] Intégrer dans module Réservations (paiement acompte)
- [ ] Intégrer dans module Paiements (enregistrement loyers)
- [ ] Tester paiements sandbox

## Acceptance
- Utilisateurs peuvent payer via Kkiapay (Mobile Money, Carte)
- Paiements confirmés automatiquement
- Reçus générés après paiement
- Mode sandbox actif