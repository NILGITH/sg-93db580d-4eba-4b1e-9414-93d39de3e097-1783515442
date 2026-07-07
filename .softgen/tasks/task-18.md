---
title: Supabase Storage - Upload Fichiers Direct
status: in_progress
priority: urgent
type: feature
tags: [storage, upload, files, media]
created_by: agent
created_at: 2026-07-07T16:05:00Z
position: 18
---

## Notes
Remplacer tous les champs URL par de vrais uploads de fichiers via Supabase Storage. Créer des buckets pour chaque type de fichier et des composants d'upload réutilisables.

## Checklist
- [ ] Créer buckets Supabase Storage (properties, documents, interventions, payments, contracts, blog)
- [ ] Créer composant FileUpload réutilisable
- [ ] Créer composant ImageUpload pour photos
- [ ] Mettre à jour module Properties (photos/vidéos)
- [ ] Mettre à jour module Interventions (photos avant/après)
- [ ] Mettre à jour module Documents (fichiers)
- [ ] Mettre à jour module Payments (justificatifs)
- [ ] Mettre à jour module Contracts (PDF signés)
- [ ] Mettre à jour module Blog (images de couverture)
- [ ] Gérer les permissions de buckets (RLS)

## Acceptance
- Utilisateurs peuvent uploader des fichiers réels
- Images s'affichent depuis Supabase Storage
- Pas de limite aux URLs externes
- Suppression de fichiers fonctionne