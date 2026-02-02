import { useState } from 'react';
import ProfileForm from './components/ProfileForm';
import ProfilesList from './components/ProfilesList';

function App() {
  const [view, setView] = useState<'form' | 'list'>('form');

  return (
    <>
      {view === 'form' ? (
        <ProfileForm onViewProfiles={() => setView('list')} />
      ) : (
        <ProfilesList onBack={() => setView('form')} />
      )}
    </>
  );
}

export default App;
