# 🔐 COMPTES DE TEST IMMO360

## Instructions d'utilisation

Pour chaque compte ci-dessous, **créez le compte via l'interface `/auth/signup`** avec l'email et le mot de passe indiqués, puis sélectionnez "Agence IMMO360 Demo" et le rôle correspondant.

---

## 👤 Comptes disponibles

### 1. 🔴 SUPER ADMIN (Administrateur Plateforme)
**Accès :** Gestion globale, toutes les agences, paramètres système

```
Email: admin@immo360.com
Mot de passe: Admin123!
Rôle: Super Admin
```

**Permissions :**
- Gestion des agences
- Gestion des utilisateurs globaux
- Statistiques plateforme
- Paramètres système
- Accès à `/admin/*`

---

### 2. 🟠 GÉRANT D'AGENCE (Admin Agency)
**Accès :** Gestion complète de son agence

```
Email: gerant@immo360.com
Mot de passe: Gerant123!
Rôle: Administrateur Agence
```

**Permissions :**
- Gestion des biens
- Gestion des mandats
- Affectation des missions
- Validation des travaux
- Suivi des paiements
- Consultation des rapports
- Communication propriétaires

---

### 3. 🟡 SECRÉTAIRE
**Accès :** Gestion administrative et documentaire

```
Email: secretaire@immo360.com
Mot de passe: Secret123!
Rôle: Secrétaire
```

**Permissions :**
- Gestion des rendez-vous
- Préparation des dossiers
- Gestion des contrats
- Gestion documentaire
- Accueil des prospects
- Organisation des visites

---

### 4. 🟢 COMMERCIAL
**Accès :** Gestion commerciale et prospects

```
Email: commercial@immo360.com
Mot de passe: Commercial123!
Rôle: Commercial
```

**Permissions :**
- Gestion des prospects
- Pipeline commercial (CRM)
- Suivi des visites
- Suivi des réservations
- Suivi des ventes
- Relances clients

---

### 5. 🔵 COMPTABLE
**Accès :** Gestion financière et comptable

```
Email: comptable@immo360.com
Mot de passe: Comptable123!
Rôle: Comptable
```

**Permissions :**
- Encaissements
- Décaissements
- Gestion des loyers
- Suivi des impayés
- Génération quittances
- Export comptable
- Tableaux financiers

---

### 6. 🟣 PROPRIÉTAIRE (Mandant)
**Accès :** Portail propriétaire uniquement

```
Email: proprietaire@immo360.com
Mot de passe: Proprio123!
Rôle: Propriétaire
```

**Permissions :**
- Consultation de SES biens
- Consultation de SES mandats
- Suivi des interventions
- Consultation des paiements
- Téléchargement des rapports
- Accès au portail `/owner`

---

## 🚀 Processus de création des comptes

1. **Allez sur** `/auth/signup`
2. **Remplissez le formulaire** avec les informations ci-dessus
3. **Sélectionnez** "Agence IMMO360 Demo" dans la liste des agences
4. **Choisissez** le rôle correspondant
5. **Cliquez** sur "Créer un compte"
6. **Vérifiez** votre email Supabase pour confirmer le compte
7. **Connectez-vous** via `/auth/login`

---

## 📊 Tableau récapitulatif

| Rôle | Email | Mot de passe | Portail principal |
|------|-------|--------------|-------------------|
| Super Admin | admin@immo360.com | Admin123! | `/admin/dashboard` |
| Gérant | gerant@immo360.com | Gerant123! | `/dashboard` |
| Secrétaire | secretaire@immo360.com | Secret123! | `/dashboard` |
| Commercial | commercial@immo360.com | Commercial123! | `/crm` |
| Comptable | comptable@immo360.com | Comptable123! | `/payments` |
| Propriétaire | proprietaire@immo360.com | Proprio123! | `/owner` |

---

## ⚠️ Important

- Ces comptes sont **uniquement pour les tests**
- **Ne les utilisez JAMAIS en production**
- Les mots de passe sont intentionnellement simples pour faciliter les tests
- Tous les comptes sont liés à l'agence "Agence IMMO360 Demo"

---

## 🔧 Dépannage

**Problème : "Email already registered"**
→ Le compte existe déjà, utilisez `/auth/login`

**Problème : "Invalid credentials"**
→ Vérifiez l'email et le mot de passe (respectez les majuscules)

**Problème : "Access denied"**
→ Vérifiez que vous avez confirmé votre email via le lien Supabase

**Problème : "Profile not found"**
→ Le profil n'a pas été créé automatiquement, contactez l'administrateur

---

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe technique.