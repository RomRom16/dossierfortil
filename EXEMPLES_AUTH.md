# Exemples d'utilisation de l'authentification

## 1. Accéder aux données utilisateur

```typescript
import { useAuth } from './contexts/AuthContext';

function UserProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profil</h1>
      <p>Email: {user?.email}</p>
      <p>Nom: {user?.user_metadata?.full_name}</p>
      <p>ID: {user?.id}</p>
    </div>
  );
}
```

## 2. Afficher du contenu uniquement si connecté

```typescript
function MyComponent() {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <p>Bienvenue, {user.email}!</p>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </div>
  );
}
```

## 3. Gérer l'état de chargement

```typescript
function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <div>Contenu: {user?.email}</div>;
}
```

## 4. Utiliser une requête Supabase authentifiée

```typescript
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';

function ProfilesList() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur:', error);
      } else {
        setProfiles(data);
      }
    };

    fetchProfiles();
  }, [user]);

  return (
    <ul>
      {profiles.map((profile) => (
        <li key={profile.id}>{profile.name}</li>
      ))}
    </ul>
  );
}
```

## 5. Vérifier les permissions

```typescript
function AdminPanel() {
  const { user } = useAuth();
  
  // Utiliser les métadonnées utilisateur ou les roles
  const isAdmin = user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return <div>Accès refusé</div>;
  }

  return <div>Panneau administrateur</div>;
}
```

## 6. Écouter les changements d'authentification

```typescript
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function MyComponent() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Événement:', event);
        console.log('Session:', session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <div>Composant avec listener auth</div>;
}
```

## 7. Récupérer la session actuelle

```typescript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function MyComponent() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();
  }, []);

  return <div>Session: {session?.user?.email}</div>;
}
```

## 8. Redirection personnalisée après connexion

Modifiez `src/pages/AuthCallback.tsx` :

```typescript
if (data?.session) {
  // Redirection personnalisée selon le rôle
  const redirectUrl = data.session.user.user_metadata?.role === 'admin' 
    ? '/admin' 
    : '/dashboard';
  
  navigate(redirectUrl, { replace: true });
}
```

## 9. Gérer les erreurs d'authentification

```typescript
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { signInWithMicrosoft } = useAuth();

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithMicrosoft();
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erreur d\'authentification'
      );
    }
  };

  return (
    <div>
      {error && <div className="text-red-600">{error}</div>}
      <button onClick={handleLogin}>Connexion</button>
    </div>
  );
}
```

## 10. Stocker les données utilisateur dans Supabase

```typescript
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { useEffect } from 'react';

function SyncUserData() {
  const { user } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          updated_at: new Date(),
        });

      if (error) console.error('Erreur:', error);
    };

    syncUser();
  }, [user]);

  return null;
}
```

## 11. Créer un hook personnalisé pour les requêtes sécurisées

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

export function useSecureQuery(table: string) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, table]);

  return { data, loading, error };
}

// Utilisation :
// const { data, loading, error } = useSecureQuery('profiles');
```

## 12. Logout avec nettoyage

```typescript
import { useAuth } from './contexts/AuthContext';

function Navbar() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Nettoyer les données locales si nécessaire
      localStorage.removeItem('userPreferences');
    } catch (error) {
      console.error('Erreur lors du logout:', error);
    }
  };

  return (
    <nav>
      {user && (
        <button onClick={handleLogout}>
          Déconnexion
        </button>
      )}
    </nav>
  );
}
```
