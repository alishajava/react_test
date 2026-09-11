import './App.css';
import SampleChart from './components/SampleChart';
import SampleGrid from './components/SampleGrid';

function App() {
  return (
    <div className="App">
      <h1>리액트 테스트 합니다.</h1>
      <section style={{ maxWidth: 600, margin: '0 auto 40px' }}>
        <SampleChart />
      </section>
      <section style={{ maxWidth: 800, margin: '0 auto' }}>
        <SampleGrid />
      </section>
    </div>
  );
}

export default App;
