---
title: Resend Email Integration
status: todo
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
- [ ] Installer SDK Resend
- [ ] Configurer clé API dans .env
- [ ] Créer service emailService
- [ ] Template email demande de visite (agent)
- [ ] Template email confirmation réservation (client)
- [ ] Template email rapport disponible (propriétaire)
- [ ] Template email paiement reçu (propriétaire)
- [ ] Template email intervention terminée (propriétaire)
- [ ] API route pour envoi emails
- [ ] Tester envois en sandbox

## Acceptance
- Emails envoyés automatiquement lors des événements
- Templates HTML professionnels
- Pièces jointes (PDF) fonctionnent
- Logs d'envoi visibles