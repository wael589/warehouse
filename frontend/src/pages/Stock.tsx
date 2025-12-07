import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stock } from '../types';
import { stockService } from '../services/stockService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Stock.css';

const StockPage: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { hasRole } = useAuth();

  useEffect(() => {
    loadStocks();
  }, [page]);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const response = await stockService.getAllStocks(page, 10);
      setStocks(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="stock-page">
        <div className="page-header">
          <h1>Gestion du Stock</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <>
            <div className="stock-table-container">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Quantité</th>
                    <th>Dernière mise à jour</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock._id}>
                      <td className="ref-number">
                        {stock.reference.referenceNumber}
                      </td>
                      <td>{stock.reference.name}</td>
                      <td>{stock.reference.category || '-'}</td>
                      <td>
                        <span className={`quantity ${stock.quantity === 0 ? 'zero' : stock.quantity < 10 ? 'low' : ''}`}>
                          {stock.quantity}
                        </span>
                      </td>
                      <td>
                        {stock.lastUpdatedBy?.username || '-'}
                        <br />
                        <small>{new Date(stock.updatedAt).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <Link
                          to={`/stock/${stock.reference._id}`}
                          className="btn-manage"
                        >
                          Gérer
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stocks.length === 0 && (
              <div className="no-data">Aucun stock trouvé</div>
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

export default StockPage;
