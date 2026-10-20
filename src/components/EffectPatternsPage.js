import { useEffect, useRef, useState } from 'react';

// --- 1. 가짜 API 호출 + 경쟁 상태(race condition) 방지 ---------------------

const FAKE_USERS = {
  1: '지훈',
  2: '수아',
  3: '민준',
};

function fakeFetchUser(id) {
  const delay = 300 + Math.random() * 1200; // 응답이 들쭉날쭉 온다고 가정
  return new Promise((resolve) => {
    setTimeout(() => resolve(FAKE_USERS[id]), delay);
  });
}

function UserLookup() {
  const [userId, setUserId] = useState(1);
  const [name, setName] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setName(null);

    fakeFetchUser(userId).then((result) => {
      // 그 사이에 userId가 또 바뀌어서 이 effect가 "구식"이 됐으면 무시
      if (!cancelled) setName(result);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div>
      {[1, 2, 3].map((id) => (
        <button key={id} onClick={() => setUserId(id)} disabled={userId === id}>
          사용자 {id}
        </button>
      ))}
      <p>{name ? `이름: ${name}` : '불러오는 중...'}</p>
      <p style={{ fontSize: 12, color: '#666' }}>
        버튼을 빠르게 연타해보세요 — 응답 속도가 제각각이라 순서가 꼬일 수
        있지만, cancelled 플래그 덕분에 항상 "마지막으로 누른 버튼"의 결과만
        반영돼요.
      </p>
    </div>
  );
}

// --- 2. 브라우저 이벤트 구독 (resize) --------------------------------------

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>현재 창 너비: {width}px (브라우저 창 크기를 바꿔보세요)</p>;
}

// --- 3. 여러 값에 의존하는 effect -------------------------------------------

const CATALOG = [
  { name: '노트북', category: '전자기기' },
  { name: '마우스', category: '전자기기' },
  { name: '책상', category: '가구' },
  { name: '의자', category: '가구' },
  { name: '모니터', category: '전자기기' },
];

function MultiDepFilter() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('전체');
  const [results, setResults] = useState(CATALOG);
  const [log, setLog] = useState('');

  useEffect(() => {
    setLog(`검색: "${keyword}" / 분류: ${category}`);
    setResults(
      CATALOG.filter(
        (item) =>
          item.name.includes(keyword) &&
          (category === '전체' || item.category === category)
      )
    );
  }, [keyword, category]);

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="이름 검색"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="전체">전체</option>
        <option value="전자기기">전자기기</option>
        <option value="가구">가구</option>
      </select>
      <ul>
        {results.map((item) => (
          <li key={item.name}>
            {item.name} ({item.category})
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 12, color: '#666' }}>effect 로그: {log}</p>
    </div>
  );
}

// --- 4. 흔한 실수 — 의존성 빠뜨리기 (stale closure) -------------------------

function BadCounter() {
  const [count, setCount] = useState(0);
  const [lastLogged, setLastLogged] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLastLogged(count); // count가 처음 값(0)으로 고정돼요
    }, 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <p>
        count: {count} / 1초마다 찍히는 값: {lastLogged}
      </p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

function GoodCounter() {
  const [count, setCount] = useState(0);
  const [lastLogged, setLastLogged] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLastLogged((_) => count); // 참고용: 아래 두 방법 중 하나로 고쳐요
    }, 1000);
    return () => clearInterval(id);
  }, [count]); // count를 의존성에 넣어서 매번 최신 값으로 effect를 재생성

  return (
    <div>
      <p>
        count: {count} / 1초마다 찍히는 값: {lastLogged}
      </p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

function StaleClosureDemo() {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <strong>❌ Bad (의존성 배열에 count 누락)</strong>
        <BadCounter />
      </div>
      <div>
        <strong>✅ Good (count를 의존성에 추가)</strong>
        <GoodCounter />
      </div>
      <p style={{ fontSize: 12, color: '#666' }}>
        +1을 몇 번 누른 다음 1초씩 기다려보세요. Bad는 "1초마다 찍히는 값"이
        0에서 멈춰있고, Good은 최신 count를 따라가요.
      </p>
    </div>
  );
}

// --- 5. useEffect가 필요 없는 경우 ------------------------------------------

function UnnecessaryEffect({ firstName, lastName }) {
  const renders = useRef(0);
  renders.current += 1;
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return (
    <p>
      ❌ {fullName} (렌더링 횟수: {renders.current}, state가 바뀌니 한 번 더
      렌더링됨)
    </p>
  );
}

function ComputedDirectly({ firstName, lastName }) {
  const renders = useRef(0);
  renders.current += 1;
  const fullName = `${firstName} ${lastName}`;

  return (
    <p>
      ✅ {fullName} (렌더링 횟수: {renders.current})
    </p>
  );
}

function NoEffectNeededDemo() {
  const [tick, setTick] = useState(0);

  return (
    <div>
      <button onClick={() => setTick(tick + 1)}>아무 상태나 변경 ({tick})</button>
      <UnnecessaryEffect firstName="홍" lastName="길동" />
      <ComputedDirectly firstName="홍" lastName="길동" />
      <p style={{ fontSize: 12, color: '#666' }}>
        버튼을 눌러보세요 — 위쪽(useEffect 버전)은 렌더링 횟수가 매번 2씩
        늘어나고(계산용 재렌더링 한 번 더), 아래쪽은 1씩만 늘어나요.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

function EffectPatternsPage() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
      <h2>useEffect 패턴 모음</h2>

      <section style={{ marginBottom: 32 }}>
        <h3>1. 가짜 API 호출 + 경쟁 상태 방지</h3>
        <UserLookup />
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>2. 브라우저 이벤트 구독 (resize)</h3>
        <WindowWidth />
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>3. 여러 값에 의존하는 effect</h3>
        <MultiDepFilter />
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>4. 흔한 실수 — 의존성 빠뜨리기</h3>
        <StaleClosureDemo />
      </section>

      <section>
        <h3>5. useEffect가 필요 없는 경우</h3>
        <NoEffectNeededDemo />
      </section>
    </div>
  );
}

export default EffectPatternsPage;
