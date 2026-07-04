---
title: Module Administration Plateforme
status: done
priority: high
type: feature
tags: [admin, super-admin, platform]
created_by: agent
created_at: 2026-07-04T13:45:00Z
position: 15
---

## Notes
Module complet d'administration pour super_admin : gestion agences, utilisateurs globaux, statistiques plateforme, paramètres système, logs d'audit.

## Checklist
- [ ] Page /admin/dashboard avec statistiques globales plateforme
- [ ] Page /admin/agencies : CRUD agences (activer/désactiver, voir stats)
- [ ] Page /admin/users : liste tous utilisateurs avec filtrage par agence/rôle
- [ ] Page /admin/settings : paramètres système (email, SMS, storage)
- [ ] Protection route : accessible uniquement aux super_admin
- [ ] Statistiques temps réel : nombre agences, users, biens, paiements

## Acceptance
- super_admin accède à tout
- Autres rôles sont bloqués (redirect)
- CRUD agences fonctionnel