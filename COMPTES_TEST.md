# 🔐 COMPTES DE TEST IMMO360

## ⚠️ IMPORTANT - Création des comptes

**Les comptes de test DOIVENT être créés manuellement** via l'interface d'inscription `/auth/signup` avec les informations ci-dessous.

Les profils ont été pré-créés dans la base de données pour les relations de données, mais **vous devez créer les comptes auth** pour pouvoir vous connecter.

---

## Instructions d'utilisation

Pour chaque compte ci-dessous, **créez le compte via l'interface `/auth/signup`** avec l'email, le mot de passe et le rôle indiqués.

**Note :** L'application est maintenant conçue pour **UNE seule agence** (IMMO360). Plus besoin de sélectionner une agence lors de l'inscription.

---

## 👤 Comptes disponibles

### 1. 🔴 ADMINISTRATEUR (Admin)
**Accès :** Gestion complète de l'agence + administration système

```
Email: admin@immo360.com
Mot de passe: Admin123!
Rôle: Administrateur
```

**Permissions :**
- Gestion des utilisateurs
- Gestion des biens
- Gestion des mandats
- Affectation des missions
- Validation des travaux
- Suivi des paiements
- Consultation des rapports
- Communication propriétaires
- Accès à `/admin/*` (paramètres système)

---

### 2. 🟡 SECRÉTAIRE
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

### 3. 🟢 COMMERCIAL
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

### 4. 🔵 COMPTABLE
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

### 5. 🟣 PROPRIÉTAIRE (Mandant)
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
3. **Choisissez** le rôle correspondant (pas besoin de sélectionner d'agence)
4. **Cliquez** sur "Créer mon compte"
5. **Connectez-vous** via `/auth/login` (la confirmation email peut être ignorée en mode dev)

---

## 📊 Tableau récapitulatif

| Rôle | Email | Mot de passe | Portail principal |
|------|-------|--------------|-------------------|
| Administrateur | admin@immo360.com | Admin123! | `/dashboard` + `/admin/*` |
| Secrétaire | secretaire@immo360.com | Secret123! | `/dashboard` |
| Commercial | commercial@immo360.com | Commercial123! | `/crm` |
| Comptable | comptable@immo360.com | Comptable123! | `/payments` |
| Propriétaire | proprietaire@immo360.com | Proprio123! | `/owner` |

---

## ⚠️ Important

- Ces comptes sont **uniquement pour les tests**
- **Ne les utilisez JAMAIS en production**
- Les mots de passe sont intentionnellement simples pour faciliter les tests
- Tous les comptes sont automatiquement liés à l'agence unique "IMMO360"
- **Vous DEVEZ créer chaque compte via `/auth/signup`** avant de pouvoir vous connecter

---

## 🔧 Dépannage

**Problème : "Email already registered"**
→ Le compte existe déjà, utilisez `/auth/login`

**Problème : "Invalid credentials"**
→ Vérifiez l'email et le mot de passe (respectez les majuscules)

**Problème : "Access denied"**
→ Le profil n'a pas été créé automatiquement, réessayez l'inscription

**Problème : "Profile not found"**
→ Le profil existe dans la base mais pas le compte auth, créez-le via `/auth/signup`

---

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe technique.