import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

export function Login() {
  const { signInWithMicrosoft, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleMicrosoftSignIn = async () => {
    try {
      setError(null);
      await signInWithMicrosoft();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FORTIL</h1>
          <p className="text-gray-600">Gestion des profils de candidats</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleMicrosoftSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
              </svg>
              Connexion avec Microsoft
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Connectez-vous avec votre compte Microsoft pour continuer
          </p>
        </div>
      </div>
    </div>
  );
}
