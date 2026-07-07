---
title: Resend Email Integration
status: done
priority: high
type: feature
tags: [email, resend, notifications, automation]
created_by: agent
created_at: 2026-07-07T16:05:03Z
position: 21
---

## Notes
Intégrer Resend pour l'envoi automatique d'emails lors d'événements clés (nouvelle visite, réservation confirmée, rapport disponible, etc.).

## Checklist
- [x] Installer SDK Resend
- [x] Configurer clé API dans .env
- [x] Créer service email.ts
- [x] Template email demande de visite
- [x] Template email confirmation réservation
- [x] Template email rapport disponible
- [x] API route pour envoi emails
- [x] Intégrer dans module Visites
- [x] Intégrer dans module Réservations
- [x] Intégrer dans module Rapports
- [x] Tester envois

## Acceptance
- Emails envoyés automatiquement lors des événements
- Templates HTML professionnels
- Pièces jointes (PDF) fonctionnent
- Logs d'envoi visibles