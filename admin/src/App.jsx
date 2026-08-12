import { useState } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Questions from './pages/Questions.jsx';
import Categories from './pages/Categories.jsx';
import Stages from './pages/Stages.jsx';
import Results from './pages/Results.jsx';
import Sessions from './pages/Sessions.jsx';

export default function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <Layout active={tab} onNavigate={setTab}>
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'questions' && <Questions />}
      {tab === 'categories' && <Categories />}
      {tab === 'stages' && <Stages />}
      {tab === 'results' && <Results />}
      {tab === 'sessions' && <Sessions />}
    </Layout>
  );
}
