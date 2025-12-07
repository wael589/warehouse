# Structure du Projet Warehouse

```
warehouse/
│
├── backend/                          # API Node.js + Express + MongoDB
│   ├── controllers/                  # Logique métier
│   │   ├── authController.js         # Authentification (login, register)
│   │   ├── referenceController.js    # Gestion des références
│   │   ├── componentController.js    # Gestion des composants
│   │   └── stockController.js        # Gestion du stock
│   │
│   ├── models/                       # Modèles Mongoose
│   │   ├── User.js                   # Utilisateurs et rôles
│   │   ├── Reference.js              # Références produits
│   │   ├── Component.js              # Composants des références
│   │   ├── Stock.js                  # Niveaux de stock
│   │   └── StockMovement.js          # Historique des mouvements
│   │
│   ├── routes/                       # Routes API
│   │   ├── auth.js                   # Routes d'authentification
│   │   ├── references.js             # Routes des références
│   │   ├── components.js             # Routes des composants
│   │   └── stock.js                  # Routes du stock
│   │
│   ├── middleware/                   # Middleware Express
│   │   └── auth.js                   # Protection des routes, vérification JWT
│   │
│   ├── utils/                        # Utilitaires
│   │   ├── generateToken.js          # Génération de tokens JWT
│   │   └── permissions.js            # Matrice de permissions par rôle
│   │
│   ├── scripts/                      # Scripts utilitaires
│   │   └── createAdmin.js            # Création d'un utilisateur admin
│   │
│   ├── .env                          # Variables d'environnement
│   ├── .env.example                  # Exemple de configuration
│   ├── package.json                  # Dépendances backend
│   └── server.js                     # Point d'entrée de l'application
│
├── frontend/                         # Application React + TypeScript
│   ├── src/
│   │   ├── components/               # Composants réutilisables
│   │   │   ├── Layout.tsx            # Layout principal avec navigation
│   │   │   ├── Layout.css
│   │   │   └── PrivateRoute.tsx      # Protection des routes
│   │   │
│   │   ├── pages/                    # Pages de l'application
│   │   │   ├── Login.tsx             # Page de connexion
│   │   │   ├── Register.tsx          # Page d'inscription
│   │   │   ├── Home.tsx              # Page d'accueil
│   │   │   ├── References.tsx        # Liste des références
│   │   │   ├── ReferenceDetail.tsx   # Détail d'une référence + composants
│   │   │   ├── NewReference.tsx      # Création de référence
│   │   │   ├── Stock.tsx             # Vue globale du stock
│   │   │   ├── StockManagement.tsx   # Gestion du stock par référence
│   │   │   ├── Auth.css              # Styles pour login/register
│   │   │   ├── Home.css              # Styles pour la page d'accueil
│   │   │   ├── References.css        # Styles pour les références
│   │   │   └── Stock.css             # Styles pour le stock
│   │   │
│   │   ├── context/                  # Contextes React
│   │   │   └── AuthContext.tsx       # Gestion de l'état d'authentification
│   │   │
│   │   ├── services/                 # Services API
│   │   │   ├── api.ts                # Configuration Axios
│   │   │   ├── authService.ts        # Service d'authentification
│   │   │   ├── referenceService.ts   # Service des références
│   │   │   ├── componentService.ts   # Service des composants
│   │   │   └── stockService.ts       # Service du stock
│   │   │
│   │   ├── types/                    # Types TypeScript
│   │   │   └── index.ts              # Interfaces et types
│   │   │
│   │   ├── App.tsx                   # Composant principal + routing
│   │   ├── App.css                   # Styles globaux
│   │   ├── index.tsx                 # Point d'entrée React
│   │   └── index.css                 # Styles de base
│   │
│   ├── public/                       # Fichiers statiques
│   ├── .env                          # Variables d'environnement frontend
│   └── package.json                  # Dépendances frontend
│
├── README.md                         # Documentation principale
├── QUICKSTART.md                     # Guide de démarrage rapide
├── PROJECT_STRUCTURE.md              # Ce fichier
└── .gitignore                        # Fichiers à ignorer par Git
```

## Flux de Données

### Authentification
1. L'utilisateur se connecte via `Login.tsx`
2. `authService.login()` envoie les identifiants au backend
3. Le backend vérifie les credentials et retourne un JWT
4. Le token est stocké dans localStorage
5. `AuthContext` maintient l'état de l'utilisateur connecté
6. Les requêtes suivantes incluent le token dans le header Authorization

### Gestion des Références
1. `References.tsx` affiche la liste paginée
2. Clic sur "Nouvelle référence" → `NewReference.tsx`
3. Soumission du formulaire → `referenceService.createReference()`
4. Le backend génère un numéro unique (REF-XXXXXX)
5. Initialisation du stock à 0
6. Redirection vers `ReferenceDetail.tsx`

### Gestion des Composants
1. Depuis `ReferenceDetail.tsx`, clic sur "Ajouter un composant"
2. Saisie de l'indice (unique par référence), nom, etc.
3. `componentService.createComponent()` envoie au backend
4. Le backend vérifie l'unicité de l'indice
5. Création du composant et rafraîchissement de la liste

### Gestion du Stock
1. `Stock.tsx` affiche tous les stocks
2. Clic sur "Gérer" → `StockManagement.tsx`
3. Choix de l'opération (init/add/remove)
4. Validation → `stockService.addStock()` ou `removeStock()`
5. Le backend met à jour le stock et enregistre le mouvement
6. Rafraîchissement de l'affichage avec le nouveau stock
7. L'historique montre tous les mouvements

## Sécurité

### Backend
- Hashage des mots de passe avec bcrypt
- Authentification JWT
- Middleware de protection des routes
- Vérification des rôles et permissions
- Validation des données entrantes avec express-validator
- Protection CORS

### Frontend
- Routes protégées avec `PrivateRoute`
- Redirection automatique si non authentifié
- Déconnexion automatique si token invalide
- Vérification des rôles pour les actions sensibles

## Permissions par Rôle

| Action | Administrateur | Gestionnaire | Magasinier | Consultant |
|--------|---------------|--------------|------------|------------|
| Voir références | ✓ | ✓ | ✓ | ✓ |
| Créer références | ✓ | ✓ | ✗ | ✗ |
| Modifier références | ✓ | ✓ | ✗ | ✗ |
| Supprimer références | ✓ | ✗ | ✗ | ✗ |
| Voir composants | ✓ | ✓ | ✓ | ✓ |
| Gérer composants | ✓ | ✓ | ✗ | ✗ |
| Voir stock | ✓ | ✓ | ✓ | ✓ |
| Modifier stock | ✓ | ✓ | ✓ | ✗ |
| Initialiser stock | ✓ | ✓ | ✗ | ✗ |
| Gérer utilisateurs | ✓ | ✗ | ✗ | ✗ |

## Technologies Utilisées

### Backend
- **Node.js** - Environnement d'exécution
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage de mots de passe
- **express-validator** - Validation des données

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

## Base de Données

### Collections MongoDB

1. **users**
   - username, email, password (hashé), role, isActive

2. **references**
   - referenceNumber (auto-généré), name, description, category, createdBy

3. **components**
   - reference (FK), indice, name, description, specifications, createdBy
   - Index unique sur (reference, indice)

4. **stocks**
   - reference (FK unique), quantity, lastUpdatedBy

5. **stockmovements**
   - reference (FK), type (IN/OUT/INIT), quantity, previousQuantity, newQuantity, reason, createdBy

## API Endpoints Complets

Consultez le README.md pour la liste complète des endpoints disponibles.
