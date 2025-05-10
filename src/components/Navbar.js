// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../pages/firebaseConfig'; // Assurez-vous que le chemin est correct

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); // Ajout pour gérer l'utilisateur
  const location = useLocation();
  const navigate = useNavigate();

  // Detect scroll for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté au chargement
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700';
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Mettre à jour l'état pour refléter la déconnexion
        navigate("/")
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-gray-800 font-bold text-xl tracking-tight">ImmoPulse</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md ${isActive('/')} hover:text-blue-600 transition-colors`}
            >
              Accueil
            </Link>
            <Link
              to="/search"
              className={`px-4 py-2 rounded-md ${isActive('/search')} hover:text-blue-600 transition-colors`}
            >
              Recherche
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-md ${isActive('/about')} hover:text-blue-600 transition-colors`}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-md ${isActive('/contact')} hover:text-blue-600 transition-colors`}
            >
              Contact
            </Link>

            {/* Affichage du lien Profil si l'utilisateur est connecté */}
            {user && (
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-md ${isActive('/profile')} hover:text-blue-600 transition-colors`}
              >
                Profil
              </Link>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mr-2"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMobileMenuOpen ? (
                // X icon for closing
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')} hover:bg-blue-50`}
          >
            Accueil
          </Link>
          <Link
            to="/search"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/search')} hover:bg-blue-50`}
          >
            Recherche
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about')} hover:bg-blue-50`}
          >
            À propos
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact')} hover:bg-blue-50`}
          >
            Contact
          </Link>

          {/* Affichage du lien Profil si l'utilisateur est connecté */}
          {user && (
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile')} hover:bg-blue-50`}
            >
              Profil
            </Link>
          )}

          {/* Bouton Se connecter ou Déconnexion */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="w-full text-center px-4 py-2 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                S'inscrire
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
