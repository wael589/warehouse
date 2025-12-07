# Warehouse Management System

Application de gestion d'entrepôt avec système d'authentification et gestion des stocks.

## Sprint 1 - Fonctionnalités Implémentées

### Authentification et Autorisation
- **US-021**: Authentification avec JWT
- **US-022**: Gestion des rôles et permissions

### Gestion des Références
- **US-001**: Créer une référence avec numéro unique auto-généré
- **US-002**: Lister les références avec pagination

### Gestion des Composants
- **US-006**: Ajouter des composants avec indice unique
- **US-007**: Lister les composants d'une référence

### Gestion du Stock
- **US-011**: Définir une quantité initiale
- **US-012**: Ajouter du stock
- **US-013**: Retirer du stock
- **US-014**: Consulter le stock total par référence

## Rôles et Permissions

### 1. Administrateur
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs et des rôles
- Configuration système

### 2. Gestionnaire
- Gestion complète des références et composants
- Gestion complète du stock
- Définition des seuils d'alerte

### 3. Magasinier
- Consultation des références et composants
- Ajout et retrait de stock
- Réalisation d'inventaires

### 4. Consultant
- Accès en lecture seule
- Consultation des rapports

## Structure du Projet

```
warehouse/
├── backend/           # API Node.js + Express + MongoDB
│   ├── controllers/   # Logique métier
│   ├── models/        # Modèles Mongoose
│   ├── routes/        # Routes API
│   ├── middleware/    # Middleware (auth, etc.)
│   ├── utils/         # Utilitaires
│   └── server.js      # Point d'entrée
│
└── frontend/          # Application React + TypeScript
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   └── types/
    └── public/
```

## Installation et Démarrage

### Prérequis
- Node.js (v16+)
- MongoDB (v4.4+)
- npm ou yarn

### Backend

```bash
cd backend
npm install

# Configurer les variables d'environnement
# Copier .env.example vers .env et configurer

# Démarrer le serveur de développement
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install

# Démarrer l'application
npm start
```

L'application démarre sur `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### References
- `GET /api/references` - Liste des références (avec pagination)
- `GET /api/references/:id` - Détail d'une référence
- `POST /api/references` - Créer une référence
- `PUT /api/references/:id` - Modifier une référence
- `DELETE /api/references/:id` - Supprimer une référence

### Components
- `GET /api/components/reference/:referenceId` - Liste des composants
- `GET /api/components/:id` - Détail d'un composant
- `POST /api/components` - Créer un composant
- `PUT /api/components/:id` - Modifier un composant
- `DELETE /api/components/:id` - Supprimer un composant

### Stock
- `GET /api/stock` - Liste de tous les stocks
- `GET /api/stock/reference/:referenceId` - Stock d'une référence
- `POST /api/stock/init` - Initialiser le stock
- `POST /api/stock/add` - Ajouter du stock
- `POST /api/stock/remove` - Retirer du stock
- `GET /api/stock/movements/:referenceId` - Historique des mouvements

## Prochaines Étapes (Sprints 2-4)

- US-003: Modifier une référence avec historique
- US-005: Recherche avancée
- US-015: Historique complet des mouvements
- US-016: Seuils d'alerte et notifications
- US-017: Inventaire physique
- US-018: Dashboard avec statistiques
- US-020: Export de données (Excel, PDF)

## Technologies Utilisées

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT pour l'authentification
- bcryptjs pour le hashage des mots de passe

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Context API pour la gestion d'état

## Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Contrôle d'accès basé sur les rôles
- Validation des données entrantes
- Protection CORS

## License

ISC
