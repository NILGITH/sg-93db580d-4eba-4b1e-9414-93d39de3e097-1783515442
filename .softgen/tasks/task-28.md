---
title: Blog Public + FAQ + Gestion Admin
status: in_progress
priority: high
type: feature
tags: [blog, faq, content, admin]
created_by: agent
created_at: 2026-07-07T17:00:00Z
position: 28
---

## Notes
Implémenter le blog public avec articles + la FAQ publique, et leurs interfaces d'administration.

Les données de test existent déjà dans la base de données (blog_posts + faq_items créés via migration).

## Checklist
- [x] Corriger erreur TypeScript (surface_area)
- [x] Page blog publique (/blog) avec liste d'articles
- [ ] Page article détaillée (/blog/[slug])
- [x] Page FAQ publique (/faq) avec accordion
- [ ] Gestion blog dans admin (liste, création, édition)
- [ ] Gestion FAQ dans admin (liste, création, édition)
- [x] Charger et afficher les données de test
- [x] Design cohérent avec charte Amiri (orange/vert/brun)
- [ ] Markdown rendering pour le contenu blog

## Acceptance
- Blog accessible sur /blog avec articles de test
- FAQ accessible sur /faq avec questions de test
- Admin peut gérer blog et FAQ depuis /admin/blog et /admin/faq
- Design moderne et responsive