---
title: Création Comptes Utilisateurs Test
status: done
priority: urgent
type: chore
tags: [auth, users, accounts, test]
created_by: agent
created_at: 2026-07-07T16:25:03Z
position: 25
---

## Notes
Créer les 5 comptes utilisateurs décrits dans COMPTES_TEST.md directement dans Supabase pour qu'ils soient immédiatement fonctionnels.

## Checklist
- [x] Script SQL pour créer les utilisateurs Supabase Auth
- [x] admin@immo360.com (role: admin)
- [x] secretaire@immo360.com (role: secretary)
- [x] commercial@immo360.com (role: agent)
- [x] comptable@immo360.com (role: accountant)
- [x] proprietaire@immo360.com (role: owner)
- [x] Créer les profils associés
- [x] Confirmer les emails automatiquement
- [x] Tester la connexion de chaque compte

## Acceptance
- Les 5 comptes se connectent sans problème
- Chaque compte voit le bon dashboard selon son rôle
- Permissions RLS fonctionnent correctement
- Pas besoin de confirmer les emails manuellement