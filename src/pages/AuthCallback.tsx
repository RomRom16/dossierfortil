import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Vérifier si on a un code de session dans l'URL
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (data?.session) {
          // Rediriger vers le dashboard après la connexion
          navigate('/', { replace: true });
        } else {
          throw new Error('Erreur lors de la récupération de la session');
        }
      } catch (err) {
        console.error('Erreur de callback:', err);
        setError(err instanceof Error ? err.message : 'Erreur d\'authentification');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Authentification en cours</h2>
        <p className="text-gray-600">Veuillez patienter...</p>
      </div>
    </div>
  );
}
