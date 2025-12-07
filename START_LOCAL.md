# Guide de Démarrage Local avec Docker

## Prérequis

- Docker Desktop installé et en cours d'exécution
- Node.js v16+ installé
- npm installé

## Étapes de Démarrage

### 1. Démarrer MongoDB avec Docker

```bash
# Depuis le répertoire racine du projet
docker-compose up -d
```

Cela va :
- Télécharger l'image MongoDB si nécessaire
- Créer un conteneur nommé `warehouse-mongodb`
- Exposer MongoDB sur le port 27017
- Créer un volume persistant pour les données

Pour vérifier que MongoDB est en cours d'exécution :
```bash
docker ps
```

Vous devriez voir `warehouse-mongodb` dans la liste.

### 2. Installer les Dépendances Backend

```bash
cd backend
npm install
```

### 3. Créer un Utilisateur Administrateur

```bash
# Depuis le dossier backend
node scripts/createAdmin.js
```

Vous devriez voir :
```
Connected to MongoDB
Admin user created successfully:
Email: admin@warehouse.com
Password: admin123
```

### 4. Démarrer le Backend

```bash
# Depuis le dossier backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

Vous devriez voir :
```
Server running on port 5000
MongoDB connected successfully
```

### 5. Installer les Dépendances Frontend (nouveau terminal)

```bash
cd frontend
npm install
```

### 6. Démarrer le Frontend

```bash
# Depuis le dossier frontend
npm start
```

L'application s'ouvre automatiquement sur `http://localhost:3000`

## Test de l'Application

### 1. Se Connecter

- URL : http://localhost:3000/login
- Email : `admin@warehouse.com`
- Mot de passe : `admin123`

### 2. Créer une Première Référence

1. Cliquez sur "Références" dans le menu
2. Cliquez sur "Nouvelle référence"
3. Remplissez :
   - Nom : "Moteur électrique"
   - Catégorie : "Électrique"
   - Description : "Moteur 220V 1500W"
4. Cliquez sur "Créer"

La référence est créée avec le numéro **REF-000001**

### 3. Ajouter des Composants

1. Dans le détail de la référence, cliquez sur "Ajouter un composant"
2. Remplissez :
   - Indice : "A"
   - Nom : "Rotor"
   - Description : "Rotor principal"
3. Ajoutez d'autres composants (B, C, etc.)

### 4. Gérer le Stock

1. Allez dans "Stock" dans le menu
2. Trouvez votre référence REF-000001
3. Cliquez sur "Gérer"
4. Cliquez sur "Initialiser le stock"
5. Entrez : 100
6. Validez

Ensuite :
- Cliquez sur "Ajouter du stock"
- Quantité : 50
- Motif : "Nouvelle livraison"
- Stock total devient : 150

Puis :
- Cliquez sur "Retirer du stock"
- Quantité : 30
- Motif : "Vente client"
- Stock total devient : 120

L'historique affiche tous les mouvements !

### 5. Tester les Permissions

1. Déconnectez-vous
2. Créez un nouveau compte avec le rôle "Consultant"
3. Reconnectez-vous avec ce compte
4. Vérifiez que vous ne pouvez PAS créer de références ou modifier le stock (lecture seule)

## Commandes Docker Utiles

### Voir les logs MongoDB
```bash
docker logs warehouse-mongodb
```

### Arrêter MongoDB
```bash
docker-compose down
```

### Arrêter et supprimer les données
```bash
docker-compose down -v
```

### Redémarrer MongoDB
```bash
docker-compose restart
```

### Accéder au shell MongoDB
```bash
docker exec -it warehouse-mongodb mongosh
```

Dans le shell MongoDB :
```javascript
// Utiliser la base de données
use warehouse

// Voir toutes les collections
show collections

// Voir les utilisateurs
db.users.find().pretty()

// Voir les références
db.references.find().pretty()

// Voir le stock
db.stocks.find().pretty()

// Voir l'historique des mouvements
db.stockmovements.find().pretty()
```

## Vérification des Ports

Si vous avez des problèmes de ports :

```bash
# Vérifier si le port 27017 est utilisé (MongoDB)
netstat -ano | findstr :27017

# Vérifier si le port 5000 est utilisé (Backend)
netstat -ano | findstr :5000

# Vérifier si le port 3000 est utilisé (Frontend)
netstat -ano | findstr :3000
```

## Dépannage

### MongoDB ne démarre pas

1. Vérifiez que Docker Desktop est en cours d'exécution
2. Vérifiez les logs : `docker logs warehouse-mongodb`
3. Essayez de redémarrer : `docker-compose restart`

### Le backend ne se connecte pas à MongoDB

1. Vérifiez que MongoDB est en cours : `docker ps`
2. Vérifiez l'URL dans `backend/.env` :
   ```
   MONGODB_URI=mongodb://localhost:27017/warehouse
   ```
3. Testez la connexion manuellement :
   ```bash
   docker exec -it warehouse-mongodb mongosh
   ```

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend est en cours sur le port 5000
2. Vérifiez `frontend/.env` :
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Vérifiez la console du navigateur pour les erreurs CORS

### Erreur "Admin user already exists"

C'est normal si vous avez déjà créé l'admin. Vous pouvez :
- Utiliser le compte existant
- Ou supprimer les données : `docker-compose down -v` puis recréer

## Tests API avec curl ou Postman

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@warehouse.com\",\"password\":\"admin123\"}"
```

### Créer une référence
```bash
# Remplacez YOUR_TOKEN par le token reçu du login
curl -X POST http://localhost:5000/api/references \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"name\":\"Test\",\"category\":\"Test\"}"
```

### Lister les références
```bash
curl -X GET http://localhost:5000/api/references \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Arrêt de l'Application

1. Arrêter le frontend : `Ctrl+C` dans le terminal
2. Arrêter le backend : `Ctrl+C` dans le terminal
3. Arrêter MongoDB : `docker-compose down`

## Sauvegarde des Données

Pour sauvegarder votre base de données :

```bash
# Créer une sauvegarde
docker exec warehouse-mongodb mongodump --db warehouse --out /dump

# Copier la sauvegarde localement
docker cp warehouse-mongodb:/dump ./backup

# Restaurer une sauvegarde
docker exec warehouse-mongodb mongorestore --db warehouse /dump/warehouse
```

## Prêt à Tester !

Votre environnement de développement est maintenant configuré. Bon test ! 🚀
