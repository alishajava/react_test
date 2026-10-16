import { useEffect, useState } from 'react';

const PRODUCTS = ['노트북', '마우스', '키보드', '모니터', '스피커'];

function EffectPage() {
  // 1) 마운트 시 한 번만 실행 — 가짜 데이터 로딩
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(PRODUCTS);
      setLoading(false);
    }, 800);

    // cleanup: 컴포넌트가 사라지기 전에 아직 안 끝난 타이머를 취소
    return () => clearTimeout(timer);
  }, []); // 빈 배열 = 처음 한 번만

  // 2) 매초 갱신되는 시계 — setInterval + cleanup
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);

    // cleanup: 화면에서 사라질 때 반드시 clearInterval 해줘야 함
    // (안 하면 보이지도 않는 컴포넌트가 계속 메모리에서 타이머를 돌림 = 메모리 누수)
    return () => clearInterval(id);
  }, []);

  // 3) 특정 값이 바뀔 때만 실행 — 검색어로 필터링
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState(PRODUCTS);

  useEffect(() => {
    console.log(`"${keyword}"로 필터링 effect 실행됨`);
    setFiltered(
      PRODUCTS.filter((p) => p.includes(keyword))
    );
  }, [keyword]); // keyword가 바뀔 때만 실행

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
      <h2>useEffect 예제</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>1. 마운트 시 한 번 — 가짜 데이터 로딩</h3>
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>2. 클린업 함수 — 매초 갱신되는 시계</h3>
        <p>{now.toLocaleTimeString()}</p>
        <p style={{ fontSize: 12, color: '#666' }}>
          이 페이지를 벗어나면 setInterval이 clearInterval로 정리돼요.
        </p>
      </section>

      <section>
        <h3>3. 의존성 배열 — 검색어로 필터링</h3>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력 (예: 마)"
        />
        <ul>
          {filtered.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p style={{ fontSize: 12, color: '#666' }}>
          콘솔(F12)을 열어두면 keyword가 바뀔 때마다 effect가 실행되는 로그가 보여요.
        </p>
      </section>
    </div>
  );
}

export default EffectPage;
