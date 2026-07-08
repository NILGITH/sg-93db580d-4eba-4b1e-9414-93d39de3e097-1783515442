---
title: Supprimer Authentification et Créer Sélecteur Profil
status: in_progress
priority: urgent
type: chore
tags: [auth, demo, profile-selector]
created_by: agent
created_at: 2026-07-08T13:03:29Z
position: 35
---

## Notes
Retirer complètement le système d'authentification Supabase et le remplacer par un simple sélecteur de profil pour le mode démo complet.

## Checklist
- [ ] Créer page sélecteur de profil (6 rôles : admin, agent, secrétaire, comptable, prestataire, propriétaire)
- [ ] Supprimer pages login/signup
- [ ] Retirer useAuth et authService
- [ ] Stocker profil sélectionné dans localStorage
- [ ] Rediriger index vers sélecteur ou dashboard selon profil stocké
- [ ] Adapter tous les composants pour utiliser le profil mocké

## Acceptance
- L'application démarre sur un sélecteur de profil
- Aucune connexion Supabase requise
- Navigation fluide entre tous les modules