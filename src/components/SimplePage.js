import { useState } from 'react';

const FRUITS = ['사과', '바나나', '포도', '딸기'];

function SimplePage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
      <h2>기본 React 기능 예제</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>1. state + 이벤트 처리</h3>
        <p>현재 값: {count}</p>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(count - 1)}>-1</button>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>2. 입력값 state로 관리하기</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
        />
        <p>{name ? `${name}님 안녕하세요!` : '이름을 입력해보세요.'}</p>
      </section>

      <section>
        <h3>3. 배열 렌더링 (map)</h3>
        <ul>
          {FRUITS.map((fruit) => (
            <li key={fruit}>{fruit}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default SimplePage;
