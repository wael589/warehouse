# Checklist de Test - Sprint 1

## Préparation

- [ ] MongoDB est démarré et accessible
- [ ] Backend installé (`cd backend && npm install`)
- [ ] Frontend installé (`cd frontend && npm install`)
- [ ] Fichier `.env` configuré dans backend
- [ ] Utilisateur admin créé (`node scripts/createAdmin.js`)

## Tests Backend

### Authentification
- [ ] POST /api/auth/register - Création d'un compte
- [ ] POST /api/auth/login - Connexion réussie
- [ ] POST /api/auth/login - Échec avec mauvais mot de passe
- [ ] GET /api/auth/me - Récupération du profil avec token
- [ ] GET /api/auth/me - Échec sans token

### Références
- [ ] POST /api/references - Création d'une référence (admin/gestionnaire)
- [ ] GET /api/references - Liste des références
- [ ] GET /api/references?page=1&limit=5 - Pagination
- [ ] GET /api/references?search=test - Recherche
- [ ] GET /api/references/:id - Détail d'une référence
- [ ] PUT /api/references/:id - Modification
- [ ] DELETE /api/references/:id - Suppression (admin uniquement)

### Composants
- [ ] POST /api/components - Création d'un composant
- [ ] POST /api/components - Échec avec indice dupliqué
- [ ] GET /api/components/reference/:refId - Liste par référence
- [ ] GET /api/components/:id - Détail d'un composant
- [ ] PUT /api/components/:id - Modification
- [ ] DELETE /api/components/:id - Suppression (admin uniquement)

### Stock
- [ ] POST /api/stock/init - Initialisation du stock
- [ ] POST /api/stock/add - Ajout de stock
- [ ] POST /api/stock/remove - Retrait de stock
- [ ] POST /api/stock/remove - Échec si quantité insuffisante
- [ ] GET /api/stock - Liste de tous les stocks
- [ ] GET /api/stock/reference/:refId - Stock d'une référence
- [ ] GET /api/stock/movements/:refId - Historique des mouvements

## Tests Frontend

### Authentification
- [ ] Page de login accessible
- [ ] Connexion réussie avec admin
- [ ] Redirection vers home après connexion
- [ ] Message d'erreur avec mauvais credentials
- [ ] Page de register accessible
- [ ] Création d'un nouveau compte
- [ ] Déconnexion fonctionne
- [ ] Redirection vers login si non authentifié

### Navigation
- [ ] Menu de navigation visible après connexion
- [ ] Lien "Références" fonctionne
- [ ] Lien "Stock" fonctionne
- [ ] Nom d'utilisateur et rôle affichés
- [ ] Bouton de déconnexion fonctionne

### Références
- [ ] Liste des références s'affiche
- [ ] Pagination fonctionne (précédent/suivant)
- [ ] Recherche fonctionne
- [ ] Bouton "Nouvelle référence" visible (admin/gestionnaire)
- [ ] Création d'une référence réussie
- [ ] Numéro auto-généré (REF-XXXXXX)
- [ ] Détail d'une référence s'affiche
- [ ] Bouton retour fonctionne
- [ ] Suppression fonctionne (admin uniquement)

### Composants
- [ ] Liste vide de composants s'affiche
- [ ] Bouton "Ajouter un composant" visible (admin/gestionnaire)
- [ ] Formulaire d'ajout s'affiche
- [ ] Création d'un composant réussie
- [ ] Erreur si indice dupliqué
- [ ] Liste mise à jour après création
- [ ] Tableau affiche tous les composants

### Stock
- [ ] Vue globale du stock s'affiche
- [ ] Pagination du stock fonctionne
- [ ] Indicateurs visuels (zéro/faible) visibles
- [ ] Bouton "Gérer" accessible
- [ ] Page de gestion du stock s'affiche
- [ ] Quantité actuelle affichée en grand
- [ ] Bouton "Initialiser" visible si pas de stock
- [ ] Initialisation du stock réussie
- [ ] Boutons "Ajouter/Retirer" visibles après init
- [ ] Ajout de stock fonctionne
- [ ] Retrait de stock fonctionne
- [ ] Erreur si retrait > stock disponible
- [ ] Historique des mouvements s'affiche
- [ ] Mouvements triés par date (plus récent en premier)

## Tests de Permissions

### Consultant (Lecture seule)
- [ ] Peut voir les références
- [ ] Peut voir les composants
- [ ] Peut voir le stock
- [ ] Ne peut PAS créer de référence
- [ ] Ne peut PAS créer de composant
- [ ] Ne peut PAS modifier le stock

### Magasinier
- [ ] Peut voir les références
- [ ] Peut voir les composants
- [ ] Peut voir le stock
- [ ] Ne peut PAS créer de référence
- [ ] Ne peut PAS créer de composant
- [ ] PEUT ajouter du stock
- [ ] PEUT retirer du stock

### Gestionnaire
- [ ] PEUT créer des références
- [ ] PEUT créer des composants
- [ ] PEUT modifier le stock
- [ ] PEUT initialiser le stock
- [ ] Ne peut PAS supprimer (réservé admin)

### Administrateur
- [ ] Accès complet à toutes les fonctionnalités
- [ ] PEUT supprimer des références
- [ ] PEUT supprimer des composants

## Tests de Validation

### Backend
- [ ] Email invalide rejeté
- [ ] Mot de passe trop court rejeté
- [ ] Champs requis validés
- [ ] Token invalide rejeté
- [ ] Token expiré rejeté

### Frontend
- [ ] Validation des formulaires
- [ ] Messages d'erreur affichés
- [ ] Champs obligatoires marqués
- [ ] Confirmation avant suppression

## Tests de Sécurité

- [ ] Token JWT généré à la connexion
- [ ] Token stocké dans localStorage
- [ ] Token envoyé dans header Authorization
- [ ] Déconnexion supprime le token
- [ ] Routes protégées sans token → redirection login
- [ ] Mots de passe non visibles en clair
- [ ] Pas d'accès CORS non autorisé

## Scénario Complet de Test

1. **Configuration initiale**
   - [ ] Démarrer MongoDB
   - [ ] Démarrer backend (port 5000)
   - [ ] Démarrer frontend (port 3000)
   - [ ] Créer utilisateur admin

2. **Premier utilisateur**
   - [ ] Se connecter comme admin
   - [ ] Vérifier affichage du nom et rôle
   - [ ] Naviguer vers Références

3. **Créer des données**
   - [ ] Créer 3 références différentes
   - [ ] Vérifier numérotation (REF-000001, 000002, 000003)
   - [ ] Ajouter 2-3 composants à chaque référence
   - [ ] Vérifier unicité des indices

4. **Gérer le stock**
   - [ ] Initialiser le stock de la première référence (100 unités)
   - [ ] Ajouter 50 unités avec motif "Livraison"
   - [ ] Retirer 30 unités avec motif "Vente"
   - [ ] Vérifier stock final = 120
   - [ ] Vérifier historique (3 entrées)

5. **Tester les permissions**
   - [ ] Créer un compte "consultant"
   - [ ] Se déconnecter
   - [ ] Se connecter comme consultant
   - [ ] Vérifier impossibilité de créer/modifier
   - [ ] Vérifier accès en lecture

6. **Vérifier la pagination**
   - [ ] Créer 15 références au total
   - [ ] Vérifier pagination (2 pages, 10 par page)
   - [ ] Naviguer entre les pages
   - [ ] Vérifier compteur de pages

7. **Tester la recherche**
   - [ ] Rechercher par nom
   - [ ] Rechercher par numéro
   - [ ] Vérifier résultats filtrés

## Résultats

- **Tests réussis** : _____ / _____
- **Tests échoués** : _____ / _____
- **Problèmes identifiés** :
  -
  -
  -

## Notes

-
-
-
