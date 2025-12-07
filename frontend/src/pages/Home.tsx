import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="home-page">
        <div className="welcome-section">
          <h1>Bienvenue dans le système de gestion d'entrepôt</h1>
          <p>Bonjour, {user?.username} - Rôle: {user?.role}</p>
        </div>

        <div className="features-grid">
          <Link to="/references" className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Références</h3>
            <p>Gérer les références et composants du catalogue</p>
          </Link>

          <Link to="/stock" className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Stock</h3>
            <p>Consulter et gérer les niveaux de stock</p>
          </Link>
        </div>

        <div className="sprint-info">
          <h2>Sprint 1 - Fonctionnalités disponibles</h2>
          <div className="features-list">
            <div className="feature-category">
              <h4>Authentification</h4>
              <ul>
                <li>Connexion avec JWT</li>
                <li>Gestion des rôles (Administrateur, Gestionnaire, Magasinier, Consultant)</li>
              </ul>
            </div>

            <div className="feature-category">
              <h4>Références</h4>
              <ul>
                <li>Création avec numéro auto-généré</li>
                <li>Liste avec pagination</li>
                <li>Gestion des composants avec indices uniques</li>
              </ul>
            </div>

            <div className="feature-category">
              <h4>Stock</h4>
              <ul>
                <li>Initialisation des quantités</li>
                <li>Ajout et retrait de stock</li>
                <li>Consultation du stock total</li>
                <li>Historique des mouvements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
