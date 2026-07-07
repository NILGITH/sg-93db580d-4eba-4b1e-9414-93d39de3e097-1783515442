---
title: Blog Public + FAQ + Gestion Admin
status: done
priority: high
type: feature
tags: [blog, faq, content, admin]
created_by: agent
created_at: 2026-07-07T17:00:00Z
position: 28
---

## Notes
✅ **Blog et FAQ complètement implémentés !**

Les données de test sont affichées correctement sur toutes les pages.

## Checklist
- [x] Corriger erreur TypeScript (surface_area)
- [x] Page blog publique (/blog) avec liste d'articles
- [x] Page article détaillée (/blog/[slug]) avec Markdown
- [x] Page FAQ publique (/faq) avec accordion
- [x] Gestion blog dans admin (/admin/blog) - complète
- [x] Gestion FAQ dans admin (/admin/faq) - complète
- [x] Charger et afficher les données de test
- [x] Design cohérent avec charte Amiri (orange/vert/brun)
- [x] Markdown rendering (react-markdown + remark-gfm)
- [x] Partage social sur articles
- [x] Articles similaires sur page détaillée
- [x] Upload images pour blog dans admin

## Acceptance
✅ Blog accessible sur /blog avec articles de test
✅ Articles détaillés sur /blog/[slug] avec markdown
✅ FAQ accessible sur /faq avec questions de test groupées par catégorie
✅ Admin peut créer/modifier/supprimer blog et FAQ
✅ Design moderne et responsive avec charte Amiri
✅ Toutes les données de test s'affichent correctement