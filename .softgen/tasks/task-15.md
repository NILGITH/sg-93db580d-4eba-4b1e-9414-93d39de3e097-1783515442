---
title: Système de Notifications
status: todo
priority: medium
type: feature
tags: [notifications, realtime]
created_by: agent
created_at: 2026-07-07T13:30:25Z
position: 15
---

## Notes
Système de notifications temps réel : nouvelle demande visite, réservation, prospect, intervention terminée, paiement, rapport disponible. Toast + email optionnel.

## Checklist
- [ ] Table notifications avec statut (non_lue, lue)
- [ ] Composant NotificationBell (badge count non lues)
- [ ] Panel notifications (dropdown avec liste)
- [ ] Trigger notifications automatiques (visite, réservation, paiement, etc.)
- [ ] Notifications temps réel (Supabase Realtime)
- [ ] Marquer comme lu/toutes lues
- [ ] Email notifications (optionnel via webhook)

## Acceptance
- Utilisateur reçoit notifications temps réel
- Badge affiche count non lues
- Panel liste toutes les notifications
- Marquage lu fonctionne