import { useState } from 'react';
import './App.css';
import SampleChart from './components/SampleChart';
import SampleGrid from './components/SampleGrid';
import SimplePage from './components/SimplePage';
import EffectPage from './components/EffectPage';
import EffectPatternsPage from './components/EffectPatternsPage';

const PAGES = {
  home: '홈',
  simple: '기본 기능 예제',
  effect: 'useEffect 예제',
  patterns: 'useEffect 패턴 모음',
};

function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="App">
      <h1>리액트 테스트 합니다.</h1>
      <nav style={{ marginBottom: 24 }}>
        {Object.entries(PAGES).map(([key, label]) => (
          <button key={key} onClick={() => setPage(key)} disabled={page === key}>
            {label}
          </button>
        ))}
      </nav>

      {page === 'home' && (
        <>
          <section style={{ maxWidth: 600, margin: '0 auto 40px' }}>
            <SampleChart />
          </section>
          <section style={{ maxWidth: 800, margin: '0 auto' }}>
            <SampleGrid />
          </section>
        </>
      )}
      {page === 'simple' && <SimplePage />}
      {page === 'effect' && <EffectPage />}
      {page === 'patterns' && <EffectPatternsPage />}
    </div>
  );
}

export default App;
