import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import Footer from '../components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction pour se connecter avec email et mot de passe
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      navigate('/'); // Rediriger vers la page d'accueil
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fonction pour se connecter via Google
  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setError('');
      navigate('/'); // Rediriger vers la page d'accueil
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100" style={{ paddingTop: '150px' }}>
      <div className="bg-white p-6 rounded-lg shadow-md w-96" style={{ marginBottom: '100px' }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Se connecter</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLoginWithEmail} className="space-y-4">
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
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500">OU</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleLoginWithGoogle}
          className="w-full p-2 bg-red-500 text-white rounded"
        >
          Se connecter avec Google
        </button>

        <p className="mt-4 text-center">
          Pas encore inscrit ? 
          <a href="/register" className="text-blue-500"> Créez un compte ici</a>
        </p>
      </div>

      {/* Le footer doit être placé ici */}
      <Footer />
    </div>
  );
};

export default LoginPage;
