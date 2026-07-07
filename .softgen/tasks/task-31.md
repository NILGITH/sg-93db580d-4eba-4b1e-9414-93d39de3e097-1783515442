---
title: Administration Complète des Biens Publics
status: done
priority: high
type: feature
tags: [admin, properties, crud, publish]
created_by: agent
created_at: 2026-07-07T17:15:23Z
position: 31
---

## Notes
Interface admin pour gérer intégralement les biens qui apparaissent sur le site public : ajout, modification, suppression et contrôle de la publication.

## Checklist
- [x] Page admin `/admin/properties-public.tsx`
- [x] Liste tous les biens (publiés et non publiés)
- [x] Recherche par référence, titre, ville
- [x] Filtres par statut de publication
- [x] Bouton créer nouveau bien avec formulaire complet
- [x] Bouton modifier bien existant
- [x] Bouton supprimer avec confirmation
- [x] Toggle publier/dépublier en un clic
- [x] Upload photos via FileUpload (Supabase Storage)
- [x] Badges visuels (publié/non publié)
- [x] Vue miniature avec photo
- [x] Lien pour voir le bien sur le site public
- [x] Interface responsive et intuitive

## Acceptance
- Les administrateurs peuvent créer, modifier et supprimer des biens depuis l'interface admin
- Le contrôle de publication fonctionne correctement
- Seuls les biens publiés apparaissent sur le catalogue public
- L'interface est intuitive et responsive