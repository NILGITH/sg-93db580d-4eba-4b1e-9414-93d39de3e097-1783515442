---
title: Auth multi-agences et RBAC
status: in_progress
priority: high
type: feature
tags: [auth, rbac, supabase]
created_by: agent
created_at: 2026-07-04T12:36:30Z
position: 3
---

## Notes
Système d'authentification avec sélection d'agence et gestion des rôles. Supabase Auth + profiles table. Rôles : super_admin, admin_agence, comptable, commercial, secretaire, proprietaire.

## Checklist
- [ ] Page login (/auth/login) avec design premium
- [ ] Page signup (/auth/signup) avec sélection agence
- [ ] Hook useAuth (user, profile, agency, role)
- [ ] AuthGuard HOC avec vérification rôle
- [ ] Service authService (login, logout, getCurrentUser, updateProfile)
- [ ] Redirection selon rôle après login

## Acceptance
- Inscription crée automatiquement le profile
- Login redirige vers dashboard approprié selon rôle
- Isolation stricte par agence