# 🔐 COMPTES DE TEST IMMO360

## ⚠️ IMPORTANT - Création des comptes

**Les comptes de test DOIVENT être créés manuellement** via l'interface d'inscription `/auth/signup` avec les informations ci-dessous.

Les profils seront créés automatiquement lors de l'inscription.

---

## 📋 Instructions d'utilisation

Pour chaque compte ci-dessous, **créez le compte via l'interface `/auth/signup`** avec l'email, le mot de passe et le rôle indiqués.

---

## 👤 Comptes disponibles

### 1. 🔴 ADMINISTRATEUR
```
Email: admin@immo360.com
Mot de passe: Admin123!
Prénom: Admin
Nom: Système
Téléphone: +22997000001
Rôle: Administrateur
```

### 2. 🟢 AGENT IMMOBILIER 1
```
Email: agent1@immo360.com
Mot de passe: Agent123!
Prénom: Kofi
Nom: Mensah
Téléphone: +22997000002
Rôle: Agent
```

### 3. 🟢 AGENT IMMOBILIER 2
```
Email: agent2@immo360.com
Mot de passe: Agent123!
Prénom: Amina
Nom: Diallo
Téléphone: +22997000003
Rôle: Agent
```

### 4. 🟡 SECRÉTAIRE
```
Email: secretaire@immo360.com
Mot de passe: Secret123!
Prénom: Sophie
Nom: Koffi
Téléphone: +22997000004
Rôle: Secrétaire
```

### 5. 🔵 COMPTABLE
```
Email: comptable@immo360.com
Mot de passe: Comptable123!
Prénom: Jean
Nom: Kouassi
Téléphone: +22997000005
Rôle: Comptable
```

### 6. 🟣 PRESTATAIRE - Plombier
```
Email: plombier@immo360.com
Mot de passe: Presta123!
Prénom: Yao
Nom: Ahomadegbe
Téléphone: +22997000006
Rôle: Prestataire
```

### 7. 🟣 PRESTATAIRE - Peintre
```
Email: peintre@immo360.com
Mot de passe: Presta123!
Prénom: Marie
Nom: Assogba
Téléphone: +22997000007
Rôle: Prestataire
```

### 8. 🟣 PRESTATAIRE - Électricien
```
Email: electricien@immo360.com
Mot de passe: Presta123!
Prénom: Paul
Nom: Tossou
Téléphone: +22997000008
Rôle: Prestataire
```

### 9. 🟠 PROPRIÉTAIRE 1
```
Email: proprietaire1@gmail.com
Mot de passe: Proprio123!
Prénom: Serge
Nom: Adjanohoun
Téléphone: +22997000009
Rôle: Propriétaire
```

### 10. 🟠 PROPRIÉTAIRE 2
```
Email: proprietaire2@gmail.com
Mot de passe: Proprio123!
Prénom: Fatou
Nom: Kone
Téléphone: +22997000010
Rôle: Propriétaire
```

### 11. 🟠 PROPRIÉTAIRE 3
```
Email: proprietaire3@gmail.com
Mot de passe: Proprio123!
Prénom: Ibrahim
Nom: Sow
Téléphone: +22997000011
Rôle: Propriétaire
```

---

## 🚀 Processus de création des comptes

1. **Allez sur** `/auth/signup`
2. **Remplissez le formulaire** avec les informations ci-dessus
3. **Choisissez** le rôle correspondant
4. **Cliquez** sur "Créer mon compte"
5. **Connectez-vous** immédiatement via `/auth/login`

**Note :** Le profil est créé automatiquement lors de l'inscription. Vous pouvez vous connecter immédiatement après.

---

## 📊 Données de test disponibles

**✅ 8 biens immobiliers** ont été créés et sont visibles :
- Dans le catalogue public `/public/catalogue` (4 biens publiés)
- Dans la gestion des biens `/properties` (8 biens au total)

**Caractéristiques des biens :**
- Appartements, villas, studios, terrains, bureaux, commerces
- Prix réalistes en FCFA
- Photos générées automatiquement
- Localisations : Cotonou, Abomey-Calavi, Porto-Novo

---

## ⚠️ Important

- Ces comptes sont **uniquement pour les tests**
- **Ne les utilisez JAMAIS en production**
- Les mots de passe sont intentionnellement simples pour faciliter les tests
- **Vous DEVEZ créer chaque compte via `/auth/signup`** avant de pouvoir vous connecter

---

## 🔧 Dépannage

**Problème : "Email already registered"**
→ Le compte existe déjà, utilisez `/auth/login`

**Problème : "Invalid credentials"**
→ Vérifiez l'email et le mot de passe (respectez les majuscules)

**Problème : "Profil utilisateur introuvable"**
→ Le trigger de création automatique a échoué. Contactez le support technique.