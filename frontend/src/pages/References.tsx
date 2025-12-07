import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reference } from '../types';
import { referenceService } from '../services/referenceService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './References.css';

const References: React.FC = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const { hasRole } = useAuth();

  useEffect(() => {
    loadReferences();
  }, [page, search]);

  const loadReferences = async () => {
    try {
      setLoading(true);
      const response = await referenceService.getReferences(page, 10, search);
      setReferences(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des références');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadReferences();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette référence ?')) {
      return;
    }

    try {
      await referenceService.deleteReference(id);
      loadReferences();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <Layout>
      <div className="references-page">
        <div className="page-header">
          <h1>Références</h1>
          {hasRole(['administrateur', 'gestionnaire']) && (
            <Link to="/references/new" className="btn-primary">
              Nouvelle référence
            </Link>
          )}
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Rechercher
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <>
            <div className="references-grid">
              {references.map((ref) => (
                <div key={ref._id} className="reference-card">
                  <div className="reference-header">
                    <h3>{ref.referenceNumber}</h3>
                    <span className="badge">{ref.category || 'Non catégorisé'}</span>
                  </div>
                  <h4>{ref.name}</h4>
                  <p>{ref.description}</p>
                  <div className="reference-footer">
                    <Link to={`/references/${ref._id}`} className="btn-view">
                      Détails
                    </Link>
                    {hasRole(['administrateur']) && (
                      <button
                        onClick={() => handleDelete(ref._id)}
                        className="btn-delete"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {references.length === 0 && (
              <div className="no-data">Aucune référence trouvée</div>
            )}

            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-page"
              >
                Précédent
              </button>
              <span>
                Page {page} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn-page"
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default References;
