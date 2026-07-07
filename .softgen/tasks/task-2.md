---
title: Authentication et Profils Utilisateurs
status: done
priority: urgent
type: feature
tags: [auth, users, rbac]
created_by: agent
created_at: 2026-07-07T13:30:26Z
position: 2
---

## Checklist
- [x] Page login avec redirection selon rôle
- [x] Page signup (réservée admin) pour créer utilisateurs
- [x] Support des 6 rôles (admin, agent, secretary, accountant, provider, owner)
- [x] Page missions pour prestataires (provider/missions.tsx)
- [x] Hook useAuth mis à jour
- [x] Messages de succès/erreur avec toast

## Acceptance
- Admin peut créer/modifier/supprimer des utilisateurs
- Authentification sécurisée via Supabase Auth
- Chaque rôle redirige vers son espace approprié