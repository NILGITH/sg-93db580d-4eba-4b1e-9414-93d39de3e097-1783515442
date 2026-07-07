# IMMO360 — Plateforme de Gestion Immobilière

## Vision
Application web unique de gestion immobilière destinée à une agence immobilière, offrant un site vitrine premium, un système de réservation de visites, et des outils de gestion métier complets.

Valeurs fondamentales : Transparence • Traçabilité • Collaboration • Automatisation

## Design
Style : Premium professionnel, interfaces de gestion patrimoniale haut de gamme

Palette :
--primary: 222 47% 11% (bleu marine profond #0F1A2B)
--primary-foreground: 210 40% 98%
--secondary: 214 32% 91%
--accent: 43 74% 66% (doré #E4B850)
--accent-foreground: 222 47% 11%
--muted: 210 40% 96%
--muted-foreground: 215 16% 47%
--background: 0 0% 100%
--foreground: 222 47% 11%
--card: 0 0% 100%
--destructive: 0 84% 60%
--border: 214 32% 91%

Typographie : 
Headings: Crimson Pro (serif élégant, 600/700)
Body: Inter (sans-serif professionnel, 400/500/600)

Direction : Espacement généreux, hiérarchie claire, accents dorés sur éléments critiques uniquement (CTA primaires, badges de statut premium, métriques importantes). Dashboards data-dense avec tabular-nums.

## Features Implémentées (MVP V1)

**Infrastructure & Auth**
- Auth avec Supabase Auth (application unique, une seule agence)
- RBAC 5 rôles (admin, secretary, commercial, accountant, proprietaire)
- RLS strict avec isolation par utilisateur
- Base de données PostgreSQL (15 tables + visit_bookings)

**Modules Core**
- Dashboard décisionnel multi-rôles avec KPI temps réel
- Gestion des Biens (CRUD complet, photos, filtrage)
- Gestion des Mandats (4 types : gestion, location, vente, gestion_complete)
- Gestion Propriétaires avec portail dédié
- Gestion Locataires
- Module Interventions + Prestataires (workflow : création → affectation → en_cours → terminee)
- Module Paiements/Encaissements (multi-moyens avec upload justificatifs)
- CRM Prospects (pipeline Kanban 6 étapes)
- GED simplifiée (upload documents par bien via Supabase Storage)
- **Assistant IA conversationnel** (rédaction annonces avec OpenAI GPT-4, 4 tons, actions rapides)

**Portails**
- Vitrine professionnelle (landing page premium avec Hero, Services, Tarifs, Contact)
- Portail Agence (dashboard + tous modules métier)
- Portail Propriétaire (/owner) — voit uniquement SES biens/mandats
- Catalogue Public (/public) — recherche biens disponibles avec réservation de visites
- Administration (/admin/*) — gestion utilisateurs, paramètres système (admin only)

## Features V2 (À venir)
- Blog + CMS (structure DB prête)
- FAQ dynamique (structure DB prête)
- Améliorer système de réservation de visites (confirmation email, notifications)
- Rapports PDF automatiques (génération mensuelle/trimestrielle)
- Notifications multi-canaux (SMS, WhatsApp)
- PWA (offline mode)
- 2FA (Supabase Auth config)
- Journal d'audit UI (table audit_logs existe)
- Comptabilité avancée (exports SAGE, écritures)