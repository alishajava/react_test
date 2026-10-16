import { useState } from 'react';
import './App.css';
import SampleChart from './components/SampleChart';
import SampleGrid from './components/SampleGrid';
import SimplePage from './components/SimplePage';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="App">
      <h1>리액트 테스트 합니다.</h1>
      <nav style={{ marginBottom: 24 }}>
        <button onClick={() => setPage('home')} disabled={page === 'home'}>
          홈
        </button>
        <button onClick={() => setPage('simple')} disabled={page === 'simple'}>
          기본 기능 예제
        </button>
      </nav>

      {page === 'home' ? (
        <>
          <section style={{ maxWidth: 600, margin: '0 auto 40px' }}>
            <SampleChart />
          </section>
          <section style={{ maxWidth: 800, margin: '0 auto' }}>
            <SampleGrid />
          </section>
        </>
      ) : (
        <SimplePage />
      )}
    </div>
  );
}

export default App;
