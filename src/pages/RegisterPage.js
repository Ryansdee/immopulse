import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction pour s'inscrire avec email et mot de passe
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
      navigate('/'); // Rediriger vers la page de connexion après inscription
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100" style={{ paddingTop: '150px' }}>
      <div className="bg-white p-6 rounded-lg shadow-md w-96" style={{ marginBottom: '100px' }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">S'inscrire</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Déjà inscrit ?
          <a href="/login" className="text-blue-500"> Se connecter ici</a>
        </p>
      </div>

      {/* Le footer doit être placé ici */}
      <Footer />
    </div>
  );
};

export default RegisterPage;
