import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import References from './pages/References';
import ReferenceDetail from './pages/ReferenceDetail';
import NewReference from './pages/NewReference';
import Stock from './pages/Stock';
import StockManagement from './pages/StockManagement';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/references"
            element={
              <PrivateRoute>
                <References />
              </PrivateRoute>
            }
          />

          <Route
            path="/references/new"
            element={
              <PrivateRoute roles={['administrateur', 'gestionnaire']}>
                <NewReference />
              </PrivateRoute>
            }
          />

          <Route
            path="/references/:id"
            element={
              <PrivateRoute>
                <ReferenceDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <PrivateRoute>
                <Stock />
              </PrivateRoute>
            }
          />

          <Route
            path="/stock/:referenceId"
            element={
              <PrivateRoute>
                <StockManagement />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
