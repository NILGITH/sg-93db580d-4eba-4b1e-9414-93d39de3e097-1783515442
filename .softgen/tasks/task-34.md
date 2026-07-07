---
title: Page Profil Utilisateur
status: done
priority: high
type: feature
tags: [profile, user, settings, avatar]
created_by: agent
created_at: 2026-07-07T17:15:23Z
position: 34
---

## Notes
Créer une page de profil utilisateur complète avec modification des informations, changement de mot de passe et upload d'avatar.

## Checklist
- [x] Affichage avatar avec initiales en fallback
- [x] Upload avatar via FileUpload (Supabase Storage)
- [x] Modification prénom, nom, téléphone
- [x] Badge rôle avec couleurs
- [x] Statistiques personnalisées selon le rôle
- [x] Onglets (Informations, Sécurité, Notifications)
- [x] Changement mot de passe sécurisé
- [x] Validation formulaires
- [x] Messages de succès/erreur avec toast
- [x] Design moderne et responsive

## Acceptance
- Les utilisateurs peuvent consulter et modifier leur profil
- Les modifications sont sauvegardées correctement
- L'upload d'avatar fonctionne avec Supabase Storage
- Le changement de mot de passe est sécurisé