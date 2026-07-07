---
title: Authentication et Profils Utilisateurs
status: todo
priority: urgent
type: feature
tags: [auth, users, rbac]
created_by: agent
created_at: 2026-07-07T13:30:25Z
position: 2
---

## Notes
Système d'authentification complet avec 6 profils utilisateurs : Administrateur, Agent Immobilier, Secrétaire, Comptable, Prestataire, Propriétaire. Chaque profil a ses permissions et son interface dédiée.

## Checklist
- [ ] Page login avec redirection par rôle
- [ ] Page signup pour création utilisateurs (admin only)
- [ ] Service authService avec gestion des 6 rôles
- [ ] Hook useAuth avec permissions par rôle
- [ ] Composant ProtectedRoute avec vérification rôle
- [ ] Page admin/users (gestion utilisateurs)

## Acceptance
- Chaque rôle accède uniquement à son espace dédié
- Admin peut créer/modifier/supprimer des utilisateurs
- Authentification sécurisée via Supabase Auth