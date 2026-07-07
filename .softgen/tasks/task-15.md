---
title: Système de Notifications
status: done
priority: medium
type: feature
tags: [notifications, realtime, alerts]
created_by: agent
created_at: 2026-07-07T13:30:39Z
position: 15
---

## Checklist
- [x] Composant NotificationBell (badge compteur, dropdown)
- [x] Page /notifications (liste complète, filtres)
- [x] Service notificationsService avec helpers
- [x] Notifications automatiques pour :
  - Nouvelle demande de visite
  - Nouvelle réservation
  - Nouveau prospect
  - Intervention terminée
  - Paiement enregistré
  - Rapport disponible
- [x] Marquer comme lu/non lu
- [x] Suppression notifications
- [x] Temps relatif d'affichage
- [x] Realtime avec Supabase subscriptions

## Acceptance
- Badge affiche nombre de notifications non lues
- Notifications arrivent en temps réel
- Clic sur notification marque lu et redirige
- Centre de notifications accessible via /notifications