import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { referenceService } from '../services/referenceService';
import Layout from '../components/Layout';
import './References.css';

const NewReference: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newRef = await referenceService.createReference(formData);
      navigate(`/references/${newRef._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="new-reference-page">
        <button onClick={() => navigate('/references')} className="btn-back">
          Retour
        </button>

        <div className="form-card">
          <h1>Nouvelle référence</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Création...' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/references')}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewReference;
