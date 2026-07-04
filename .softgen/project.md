# IMMO360 — Plateforme SaaS de Gestion Immobilière Multi-Agences

## Vision
Digitaliser l'ensemble des activités immobilières dans une plateforme collaborative SaaS offrant visibilité temps réel, transparence totale et automatisation intelligente. Destinée aux agences immobilières, administrateurs de biens et sociétés de gestion locative.

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
- Auth multi-agences avec Supabase Auth
- RBAC 6 rôles (super_admin, admin_agency, secretary, commercial, accountant, proprietaire)
- RLS strict avec isolation multi-agences
- Base de données PostgreSQL (15 tables)

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

**Portails**
- Vitrine professionnelle (landing page premium avec Hero, Services, Tarifs, Contact)
- Portail Agence (dashboard + tous modules métier)
- Portail Propriétaire (/owner) — voit uniquement SES biens/mandats
- Catalogue Public (/public) — recherche biens disponibles
- Administration Plateforme (/admin/*) — gestion agences, users, settings (super_admin only)

## Features V2 (À venir)
- Blog + CMS (structure DB prête)
- FAQ dynamique (structure DB prête)
- Assistant IA conversationnel
- Rapports PDF automatiques (génération mensuelle/trimestrielle)
- Notifications multi-canaux (SMS, WhatsApp)
- PWA (offline mode)
- 2FA (Supabase Auth config)
- Journal d'audit UI (table audit_logs existe)
- Comptabilité avancée (exports SAGE, écritures)