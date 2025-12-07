import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reference, Component } from '../types';
import { referenceService } from '../services/referenceService';
import { componentService } from '../services/componentService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './References.css';

const ReferenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [reference, setReference] = useState<Reference | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [newComponent, setNewComponent] = useState({
    indice: '',
    name: '',
    description: '',
    specifications: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [refData, compData] = await Promise.all([
        referenceService.getReference(id),
        componentService.getComponentsByReference(id)
      ]);
      setReference(refData);
      setComponents(compData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await componentService.createComponent({
        reference: id,
        ...newComponent
      });
      setNewComponent({ indice: '', name: '', description: '', specifications: '' });
      setShowAddComponent(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'ajout du composant');
    }
  };

  if (loading) return <Layout><div className="loading">Chargement...</div></Layout>;
  if (error) return <Layout><div className="error-message">{error}</div></Layout>;
  if (!reference) return <Layout><div>Référence non trouvée</div></Layout>;

  return (
    <Layout>
      <div className="reference-detail">
        <button onClick={() => navigate('/references')} className="btn-back">
          Retour
        </button>

        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h1>{reference.name}</h1>
              <p className="reference-number">{reference.referenceNumber}</p>
            </div>
            <span className="badge">{reference.category || 'Non catégorisé'}</span>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{reference.description || 'Aucune description'}</p>
          </div>

          <div className="detail-section">
            <h3>Informations</h3>
            <p>Créé par: {reference.createdBy.username}</p>
            <p>Date de création: {new Date(reference.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="components-section">
          <div className="section-header">
            <h2>Composants</h2>
            {hasRole(['administrateur', 'gestionnaire']) && (
              <button
                onClick={() => setShowAddComponent(!showAddComponent)}
                className="btn-primary"
              >
                Ajouter un composant
              </button>
            )}
          </div>

          {showAddComponent && (
            <form onSubmit={handleAddComponent} className="add-component-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Indice *</label>
                  <input
                    type="text"
                    value={newComponent.indice}
                    onChange={(e) => setNewComponent({ ...newComponent, indice: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newComponent.description}
                  onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Spécifications</label>
                <textarea
                  value={newComponent.specifications}
                  onChange={(e) => setNewComponent({ ...newComponent, specifications: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Ajouter</button>
                <button
                  type="button"
                  onClick={() => setShowAddComponent(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {components.length === 0 ? (
            <div className="no-data">Aucun composant</div>
          ) : (
            <div className="components-table">
              <table>
                <thead>
                  <tr>
                    <th>Indice</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Spécifications</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((comp) => (
                    <tr key={comp._id}>
                      <td>{comp.indice}</td>
                      <td>{comp.name}</td>
                      <td>{comp.description || '-'}</td>
                      <td>{comp.specifications || '-'}</td>
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

export default ReferenceDetail;
