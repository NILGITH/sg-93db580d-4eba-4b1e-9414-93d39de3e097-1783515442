---
title: Kkiapay Payment Integration (Sandbox)
status: todo
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
- [ ] Installer SDK Kkiapay
- [ ] Configurer clés API sandbox dans .env
- [ ] Créer composant KkiapayButton
- [ ] Intégrer dans module Réservations (paiement acompte)
- [ ] Intégrer dans module Paiements (enregistrement loyers)
- [ ] Webhook pour confirmer paiements
- [ ] Enregistrer transactions dans DB
- [ ] Notifications après paiement réussi
- [ ] Gestion des erreurs et annulations

## Acceptance
- Utilisateurs peuvent payer via Kkiapay (Mobile Money, Carte)
- Paiements confirmés automatiquement
- Reçus générés après paiement
- Mode sandbox actif