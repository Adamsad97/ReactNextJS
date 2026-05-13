# TaskFlow - Gestion de tâches collaborative

## 🚀 Démarrage Rapide

### 1. Pré-requis
Créez un fichier `.env` à la racine du projet sur le modèle suivant :
```env
DATABASE_URL="postgresql://taskflow:taskflow_secret@localhost:5433/taskflow"
JWT_SECRET="votre_secret_jwt_tres_long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="votre_cle_resend"
EMAIL_FROM="votre_email_verifie"
```

---

### 🐳 Via Docker (Recommandé)

1. **Lancer les services (Base de données, Redis, App) :**
   ```bash
   docker-compose up -d --build
   ```
2. **Insérer les données de test (Utilisateurs, Projets, Tâches) :**
   ```bash
   docker exec -it task-flow-app npx tsx app/scripts/seed.ts
   ```
3. **Accéder à l'application :** `http://localhost:3000`

---

### 📦 Via NPM (Développement local)

1. **Installer les dépendances :**
   ```bash
   npm install
   ```
2. **Lancer la base de données (si Docker installé) :**
   ```bash
   docker-compose up -d postgres redis
   ```
3. **Appliquer les migrations et générer Prisma :**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
4. **Insérer les utilisateurs de test :**
   ```bash
   npx tsx app/scripts/seed.ts
   ```
5. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

---

### 🛠️ Commandes Utiles

- **Arrêter Docker :** `docker-compose down`
- **Réinitialiser la DB :** `npx prisma migrate reset`
- **Accéder à Prisma Studio :** `npx prisma studio`

---

### 👥 Comptes de Test (via Seed)
- **Alice :** `alice@taskflow.dev` / `password123` (Propriétaire)
- **Bob :** `bob@taskflow.dev` / `password123` (Membre)
- **Carla :** `carla@taskflow.dev` / `password123` (Membre)
