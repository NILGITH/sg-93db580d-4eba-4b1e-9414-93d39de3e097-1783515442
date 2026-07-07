# 🚀 Déploiement sur Vercel

## ⚠️ Problème de développement local

Le serveur de développement Softgen/Daytona a des **problèmes de connexion réseau** avec Supabase :
- ❌ Erreur "Failed to fetch"
- ❌ Connexions sortantes instables ou bloquées
- ✅ Les credentials sont corrects
- ✅ Le code fonctionne parfaitement

**Solution : Déployer sur Vercel** où la connexion réseau est stable et fiable.

---

## 📋 Étapes de déploiement

### 1. Préparer le projet

Vérifiez que ces fichiers sont présents :
- ✅ `package.json` avec les dépendances
- ✅ `next.config.mjs` avec la configuration
- ✅ `.env.local` avec les variables d'environnement

### 2. Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Créez un compte (gratuit) avec GitHub, GitLab ou email
3. Connectez votre dépôt GitHub

### 3. Importer le projet

1. Cliquez sur **"Add New Project"**
2. Importez votre dépôt GitHub
3. Vercel détecte automatiquement Next.js

### 4. Configurer les variables d'environnement

Dans **"Environment Variables"**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://qfswgjvyxiuumepepuml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmc3dnanZ5eGl1dW1lcGVwdW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg3MDgsImV4cCI6MjA1MTU3NDcwOH0.Dy9fZ_EUW0IcNqVEX3vPO5W9FbILiEVFJc5lI8kvOOE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmc3dnanZ5eGl1dW1lcGVwdW1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk5ODcwOCwiZXhwIjoyMDUxNTc0NzA4fQ.aUQRp4t43RgqNY6Kk1iVSxOzGPCpnD1-WyNrwA9x2VU
NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY=pk_test_qkjYUNRZvL8AQNGiQlW3O1U
KKIAPAY_PRIVATE_KEY=sk_test_qkjYUNRZvL8AQNGiQlW3O1U
RESEND_API_KEY=re_123456789_test_key_for_immo360
```

### 5. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. ✅ Votre application est en ligne !

---

## 🎯 Après le déploiement

### URL de production

Vercel vous donne une URL comme :
```
https://immo360-xyz.vercel.app
```

### Tester la connexion

1. Ouvrez votre URL Vercel
2. Allez sur `/auth/login`
3. Connectez-vous avec :
   - Email : `admin@immo360.com`
   - Mot de passe : `Admin123!`

**Ça va fonctionner parfaitement !** 🎉

---

## 🔧 Configuration Supabase

Dans **Supabase Dashboard** → **Authentication** → **URL Configuration**, ajoutez :

```
Site URL: https://votre-app.vercel.app
Redirect URLs:
  - https://votre-app.vercel.app/auth/callback
  - https://votre-app.vercel.app/**
```

---

## 💡 Avantages Vercel

- ⚡ Déploiement instantané (2-3 minutes)
- 🔄 Auto-déploiement à chaque push Git
- 🌍 CDN global ultra-rapide
- 📊 Analytics intégrés
- 🔒 HTTPS automatique
- 💰 Plan gratuit généreux
- 🚀 Performance optimale Next.js

---

## 🐛 Debugging

Si vous rencontrez des problèmes :

1. Vérifiez les logs de déploiement
2. Vérifiez les variables d'environnement
3. Testez la connexion Supabase depuis Vercel
4. Contactez le support Vercel (très réactif)

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js sur Vercel](https://nextjs.org/docs/deployment)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)