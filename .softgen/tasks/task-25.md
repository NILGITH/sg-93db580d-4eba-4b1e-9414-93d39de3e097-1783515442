---
title: Création Comptes Utilisateurs Test
status: todo
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
- [ ] Script SQL pour créer les utilisateurs Supabase Auth
- [ ] admin@immo360.com (role: admin)
- [ ] secretaire@immo360.com (role: secretary)
- [ ] commercial@immo360.com (role: agent)
- [ ] comptable@immo360.com (role: accountant)
- [ ] proprietaire@immo360.com (role: owner)
- [ ] Créer les profils associés
- [ ] Confirmer les emails automatiquement
- [ ] Tester la connexion de chaque compte

## Acceptance
- Les 5 comptes se connectent sans problème
- Chaque compte voit le bon dashboard selon son rôle
- Permissions RLS fonctionnent correctement
- Pas besoin de confirmer les emails manuellement