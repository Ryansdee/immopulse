// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { updateEmail, updatePassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Footer from '../components/Footer'; // Assurez-vous que le Footer est bien importé

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setNewEmail(currentUser.email || '');
    }
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (newEmail !== user.email) {
        await updateEmail(user, newEmail);
        alert('Email mis à jour avec succès.');
      } else {
        alert('L\'email n\'a pas changé.');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'email');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (newPassword.length >= 6) {
        await updatePassword(user, newPassword);
        alert('Mot de passe mis à jour avec succès.');
      } else {
        alert('Le mot de passe doit comporter au moins 6 caractères.');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du mot de passe');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100" style={{ paddingTop: '150px' }}>
      <div className="bg-white p-6 rounded-lg shadow-md w-96" style={{ marginBottom: '100px' }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Mon Profil</h2>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        {user ? (
          <>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <form onSubmit={handleEmailChange} className="space-y-4">
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Mettre à jour l\'email'}
                </button>
              </form>
            </div>

            <div className="mt-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Nouveau Mot de passe</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Entrez un nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Mettre à jour le mot de passe'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Veuillez vous connecter pour voir votre profil.</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
