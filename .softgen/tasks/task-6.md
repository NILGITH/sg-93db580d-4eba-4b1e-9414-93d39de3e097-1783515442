---
title: Module Demandes de Visite
status: todo
priority: high
type: feature
tags: [visits, prospects]
created_by: agent
created_at: 2026-07-07T13:30:25Z
position: 6
---

## Notes
Système de demande de visite depuis le site public. Le visiteur remplit un formulaire, la demande est enregistrée et l'agent reçoit une notification.

## Checklist
- [ ] Formulaire demande visite sur fiche bien (nom, prénom, tel, email, date, heure, commentaire)
- [ ] Enregistrement dans table visits
- [ ] Création automatique prospect si nouveau
- [ ] Page visits/index pour agents (liste demandes)
- [ ] Statut visite (en_attente, confirmee, effectuee, annulee)
- [ ] Notification agent (toast + email optionnel)
- [ ] Confirmation email visiteur

## Acceptance
- Visiteur peut demander une visite depuis n'importe quel bien
- Agent voit toutes les demandes dans son espace
- Prospect est créé automatiquement
- Notifications fonctionnent