# Guide de Démarrage Rapide

## Prérequis

- Node.js v16 ou supérieur
- MongoDB v4.4 ou supérieur
- npm ou yarn

## Installation

### 1. Backend

```bash
cd backend
npm install

# Configurer les variables d'environnement
# Modifiez le fichier .env avec vos paramètres
# Assurez-vous que MongoDB est en cours d'exécution

# Créer un utilisateur administrateur
node scripts/createAdmin.js

# Démarrer le serveur de développement
npm run dev
```

Le serveur backend démarre sur `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install

# Démarrer l'application React
npm start
```

L'application frontend démarre sur `http://localhost:3000`

## Compte Administrateur par Défaut

Après avoir exécuté le script `createAdmin.js`, vous pouvez vous connecter avec :

- **Email**: admin@warehouse.com
- **Mot de passe**: admin123

**IMPORTANT**: Changez ce mot de passe après la première connexion !

## Créer d'Autres Utilisateurs

Vous pouvez créer d'autres utilisateurs via :
1. L'interface d'inscription (`/register`)
2. Via l'API directement

### Rôles Disponibles

- **administrateur**: Accès complet
- **gestionnaire**: Gestion des références, composants et stock
- **magasinier**: Gestion du stock uniquement
- **consultant**: Lecture seule

## Tester l'Application

### 1. Créer une Référence

1. Connectez-vous avec le compte admin
2. Allez dans "Références"
3. Cliquez sur "Nouvelle référence"
4. Remplissez le formulaire et validez

### 2. Ajouter des Composants

1. Ouvrez une référence
2. Cliquez sur "Ajouter un composant"
3. Remplissez les informations (indice, nom, etc.)

### 3. Gérer le Stock

1. Allez dans "Stock"
2. Cliquez sur "Gérer" pour une référence
3. Initialisez le stock ou ajoutez/retirez des quantités

## Dépannage

### Erreur de connexion MongoDB

Vérifiez que MongoDB est en cours d'exécution :
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Port déjà utilisé

Si le port 5000 ou 3000 est déjà utilisé, vous pouvez les modifier :
- Backend : Changez `PORT` dans `.env`
- Frontend : Changez dans `package.json` ou utilisez une variable d'environnement

### Erreurs CORS

Assurez-vous que l'URL de l'API dans le frontend correspond à l'URL du backend :
- Vérifiez `frontend/.env` : `REACT_APP_API_URL=http://localhost:5000/api`

## Structure des Données

### Références
- Numéro auto-généré (REF-000001, REF-000002, etc.)
- Nom, description, catégorie
- Composants associés

### Composants
- Indice unique par référence
- Nom, description, spécifications

### Stock
- Quantité par référence
- Historique complet des mouvements (entrées/sorties)
- Suivi de l'utilisateur et de la date

## API Endpoints Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Références
- `GET /api/references` - Liste
- `POST /api/references` - Créer
- `GET /api/references/:id` - Détail
- `PUT /api/references/:id` - Modifier
- `DELETE /api/references/:id` - Supprimer

### Composants
- `GET /api/components/reference/:refId` - Liste par référence
- `POST /api/components` - Créer
- `PUT /api/components/:id` - Modifier
- `DELETE /api/components/:id` - Supprimer

### Stock
- `GET /api/stock` - Liste complète
- `GET /api/stock/reference/:refId` - Stock d'une référence
- `POST /api/stock/init` - Initialiser
- `POST /api/stock/add` - Ajouter
- `POST /api/stock/remove` - Retirer
- `GET /api/stock/movements/:refId` - Historique

## Prochaines Fonctionnalités (Sprint 2-4)

- Modification de références avec historique
- Recherche avancée
- Seuils d'alerte
- Inventaire physique
- Dashboard avec statistiques
- Export Excel/PDF

## Support

Pour toute question ou problème, consultez :
- README.md pour plus de détails
- Les fichiers de code source
- La documentation des dépendances
