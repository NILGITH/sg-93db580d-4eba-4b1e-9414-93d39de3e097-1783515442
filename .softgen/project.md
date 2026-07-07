# AMIRI — Application de Gestion Immobilière Complète

## Vision
Application web unique de gestion immobilière pour UNE SEULE agence, centralisant toute l'activité : gestion des biens, propriétaires, locataires, prospects, interventions, paiements, et rapports. Intègre un site vitrine public permettant consultation des offres, demandes de visites, et réservations en ligne.

Valeurs : Centralisation • Transparence • Automatisation • Simplicité

## Design
Style : Professionnel moderne, interfaces claires et épurées avec tons bleus élégants

Palette :
--primary: 213 34% 14% (bleu marine profond #1A1A2E)
--primary-foreground: 204 100% 92% (bleu clair #BBE1FA)
--secondary: 210 50% 20% (bleu foncé #16213E)
--accent: 199 89% 39% (bleu vif moderne #3282B8)
--muted: 210 40% 96% (gris clair)
--muted-foreground: 210 20% 50%
--background: 0 0% 100% (blanc)
--foreground: 213 34% 14%

Typographie :
Headings: Crimson Pro (serif professionnel, 600/700)
Body: Inter (sans-serif moderne, 400/500/600)

Direction : Interfaces respirantes, hiérarchie claire, accents bleus vifs sur actions critiques (CTA, badges premium, métriques clés). Dashboards data-dense avec tabular-nums. Animations Framer Motion subtiles et élégantes.

## Features (Cahier des charges complet)

**6 Profils Utilisateurs**
- Administrateur (accès total)
- Agent Immobilier (gestion biens, visites, locations, ventes)
- Secrétaire (rendez-vous, prospects, contrats, réservations)
- Comptable (paiements, loyers, impayés, rapports financiers)
- Prestataire (missions affectées, photos, commentaires, clôture)
- Mandant/Propriétaire (espace personnel : biens, loyers, dépenses, interventions, documents)

**Gestion des Biens**
- Référence, type (8 types), statut (4 statuts)
- Vente ou location
- Localisation (adresse, ville, commune, quartier, GPS)
- Caractéristiques (pièces, surface, prix)
- Description, équipements
- Photos, vidéos, documents (Supabase Storage)
- Publication sur site vitrine

**Site Web Vitrine**
- Accueil (hero animé, recherche, biens récents, vedette)
- Catalogue filtrable (vente/location, type, localisation, prix, pièces, surface)
- Fiche bien détaillée (galerie, vidéos, carte, caractéristiques, contact)
- Demande de visite (formulaire → notification agent)
- Réservation en ligne (meublés : dates, acompte Kkiapay, confirmation)
- Demande d'information (contact direct)

**Gestion des Prospects**
- Enregistrement automatique
- Historique des échanges
- Type de demande (visite, info, réservation)
- Suivi commercial (CRM)

**Gestion des Interventions**
- Création par agents
- Affectation prestataire
- Photos avant/après (Supabase Storage)
- Commentaires
- Validation/clôture
- Types : plomberie, peinture, climatisation, maçonnerie, nettoyage

**Gestion des Paiements**
- Loyers, acomptes, réservations
- Modes : Espèces, Mobile Money (Kkiapay), Carte, Chèque, Virement
- Photo justificatif (Supabase Storage)
- Suivi des impayés
- Génération reçus PDF

**Rapports Automatisés**
- Mensuels, trimestriels, semestriels, annuels
- Loyers encaissés, dépenses, interventions
- Graphiques, rentabilité
- Export PDF (jsPDF)
- Envoi email automatique (Resend)

**Documents**
- Bibliothèque par bien (Supabase Storage)
- Contrats, factures, reçus
- Photos, vidéos, plans
- Documents administratifs

**Blog et Conseils**
- Articles avec images (Supabase Storage)
- Conseils immobiliers
- Vidéos courtes
- FAQ dynamique

**Notifications**
- Nouvelle demande de visite
- Nouvelle réservation
- Nouveau prospect
- Intervention terminée
- Paiement enregistré
- Rapport disponible
- Emails automatiques (Resend)

**Tableau de Bord**
- Statistiques temps réel
- Biens (total, disponibles, loués, vendus)
- Revenus, loyers, impayés
- Visites programmées
- Réservations actives
- Nouveaux prospects
- Interventions en cours

**Intégrations**
- Supabase Storage (upload fichiers)
- Kkiapay Sandbox (paiements mobile money)
- jsPDF (génération PDF)
- Resend (emails automatiques)
- Framer Motion (animations)