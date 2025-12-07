import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stock, StockMovement, Reference } from '../types';
import { stockService } from '../services/stockService';
import { referenceService } from '../services/referenceService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Stock.css';

const StockManagement: React.FC = () => {
  const { referenceId } = useParams<{ referenceId: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [reference, setReference] = useState<Reference | null>(null);
  const [stock, setStock] = useState<Stock | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [operation, setOperation] = useState<'add' | 'remove' | 'init' | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadData();
  }, [referenceId]);

  const loadData = async () => {
    if (!referenceId) return;

    try {
      setLoading(true);
      const [refData, stockData, movementsData] = await Promise.all([
        referenceService.getReference(referenceId),
        stockService.getStockByReference(referenceId).catch(() => null),
        stockService.getStockMovements(referenceId)
      ]);

      setReference(refData);
      setStock(stockData);
      setMovements(movementsData.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId || !operation) return;

    try {
      if (operation === 'init') {
        await stockService.initializeStock({ reference: referenceId, quantity });
      } else if (operation === 'add') {
        await stockService.addStock({ reference: referenceId, quantity, reason });
      } else if (operation === 'remove') {
        await stockService.removeStock({ reference: referenceId, quantity, reason });
      }

      setQuantity(0);
      setReason('');
      setOperation(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'IN': return 'Entrée';
      case 'OUT': return 'Sortie';
      case 'INIT': return 'Initialisation';
      default: return type;
    }
  };

  if (loading) return <Layout><div className="loading">Chargement...</div></Layout>;
  if (error) return <Layout><div className="error-message">{error}</div></Layout>;
  if (!reference) return <Layout><div>Référence non trouvée</div></Layout>;

  const canModify = hasRole(['administrateur', 'gestionnaire', 'magasinier']);

  return (
    <Layout>
      <div className="stock-management">
        <button onClick={() => navigate('/stock')} className="btn-back">
          Retour
        </button>

        <div className="stock-header">
          <div>
            <h1>{reference.name}</h1>
            <p className="reference-number">{reference.referenceNumber}</p>
          </div>
          <div className="stock-quantity-display">
            <div className="quantity-label">Stock actuel</div>
            <div className={`quantity-value ${!stock || stock.quantity === 0 ? 'zero' : stock.quantity < 10 ? 'low' : ''}`}>
              {stock?.quantity || 0}
            </div>
          </div>
        </div>

        {canModify && (
          <div className="operations-section">
            <h2>Opérations sur le stock</h2>
            <div className="operation-buttons">
              {!stock && (
                <button
                  onClick={() => setOperation('init')}
                  className="btn-operation init"
                >
                  Initialiser le stock
                </button>
              )}
              {stock && (
                <>
                  <button
                    onClick={() => setOperation('add')}
                    className="btn-operation add"
                  >
                    Ajouter du stock
                  </button>
                  <button
                    onClick={() => setOperation('remove')}
                    className="btn-operation remove"
                  >
                    Retirer du stock
                  </button>
                </>
              )}
            </div>

            {operation && (
              <form onSubmit={handleOperation} className="operation-form">
                <h3>
                  {operation === 'init' && 'Initialiser le stock'}
                  {operation === 'add' && 'Ajouter du stock'}
                  {operation === 'remove' && 'Retirer du stock'}
                </h3>

                <div className="form-group">
                  <label>Quantité *</label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                {operation !== 'init' && (
                  <div className="form-group">
                    <label>Motif</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Valider
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOperation(null);
                      setQuantity(0);
                      setReason('');
                    }}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="movements-section">
          <h2>Historique des mouvements</h2>
          {movements.length === 0 ? (
            <div className="no-data">Aucun mouvement enregistré</div>
          ) : (
            <div className="movements-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Quantité</th>
                    <th>Stock avant</th>
                    <th>Stock après</th>
                    <th>Motif</th>
                    <th>Utilisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement._id}>
                      <td>{new Date(movement.createdAt).toLocaleString()}</td>
                      <td>
                        <span className={`movement-type ${movement.type.toLowerCase()}`}>
                          {getMovementTypeLabel(movement.type)}
                        </span>
                      </td>
                      <td className={movement.type === 'OUT' ? 'negative' : 'positive'}>
                        {movement.type === 'OUT' ? '-' : '+'}{movement.quantity}
                      </td>
                      <td>{movement.previousQuantity}</td>
                      <td>{movement.newQuantity}</td>
                      <td>{movement.reason || '-'}</td>
                      <td>{movement.createdBy.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StockManagement;
