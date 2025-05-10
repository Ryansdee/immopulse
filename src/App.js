// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import Navbar from './components/Navbar'; // Import du composant Navbar
import AboutPage from './pages/AboutPage'; // Import de la page "À propos"
import ContactPage from './pages/ContactPage'; // Import de la page "Contact"
import LoginPage from './pages/LoginPage'; // Import de la page "Connexion"
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<h2>Page non trouvée</h2>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
