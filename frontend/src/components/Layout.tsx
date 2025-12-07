import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Warehouse Management</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/references">Références</Link>
          <Link to="/stock">Stock</Link>
          {hasRole(['administrateur', 'gestionnaire']) && (
            <Link to="/admin">Administration</Link>
          )}
        </div>
        <div className="navbar-user">
          <span>{user?.username} ({user?.role})</span>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
