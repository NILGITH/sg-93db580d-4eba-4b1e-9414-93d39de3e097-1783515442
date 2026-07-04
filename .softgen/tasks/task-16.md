---
title: Assistant IA - Rédaction d'annonces
status: done
priority: high
type: feature
tags: [ai, assistant, openai, chat]
created_by: agent
created_at: 2026-07-04T13:56:00Z
position: 16
---

## Notes
Interface de chat IA conversationnelle pour aider les agents immobiliers à rédiger des annonces professionnelles. L'assistant peut générer des descriptions, améliorer des textes existants, suggérer des titres et adapter le ton selon le contexte.

Nécessite OPENAI_API_KEY configurée dans .env.local

## Checklist
- [ ] Créer route API /api/ai/generate-listing (appel OpenAI GPT-4)
- [ ] Créer page /ai-assistant avec interface chat
- [ ] Interface conversationnelle avec historique messages
- [ ] Formulaire contexte bien (type, surface, prix, caractéristiques)
- [ ] Sélecteur de ton (professionnel, chaleureux, premium, commercial)
- [ ] Boutons actions rapides (générer description, améliorer texte, suggérer titre)
- [ ] Copier le texte généré en un clic
- [ ] Historique conversations sauvegardé (localStorage)
- [ ] Design cohérent avec le reste de l'app

## Acceptance
- Agent peut générer une annonce complète en quelques secondes
- Texte généré est de qualité professionnelle
- Interface intuitive et rapide