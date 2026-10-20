import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: '티셔츠', price: 19000, emoji: '👕' },
  { id: 2, name: '청바지', price: 45000, emoji: '👖' },
  { id: 3, name: '운동화', price: 68000, emoji: '👟' },
  { id: 4, name: '모자', price: 15000, emoji: '🧢' },
  { id: 5, name: '가방', price: 52000, emoji: '🎒' },
];

function formatPrice(price) {
  return price.toLocaleString() + '원';
}

function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function ProductCard({ product, onAddToCart }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 40 }}>{product.emoji}</div>
      <p style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>{product.name}</p>
      <p style={{ margin: '0 0 8px', color: '#666' }}>{formatPrice(product.price)}</p>
      <button onClick={() => onAddToCart(product)}>장바구니 담기</button>
    </div>
  );
}

function CartItem({ item, onChangeQty, onRemove }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ flex: 1 }}>
        {item.emoji} {item.name}
      </span>
      <button onClick={() => onChangeQty(item.id, -1)}>-</button>
      <span>{item.qty}</span>
      <button onClick={() => onChangeQty(item.id, 1)}>+</button>
      <span style={{ width: 80, textAlign: 'right' }}>
        {formatPrice(item.price * item.qty)}
      </span>
      <button onClick={() => onRemove(item.id)}>삭제</button>
    </li>
  );
}

// 1) 상품 목록 + 장바구니 화면 ------------------------------------------------

function ShoppingView({ cart, onAddToCart, onChangeQty, onRemove, onCheckout }) {
  const total = cartTotal(cart);

  return (
    <>
      <h3>상품 목록</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 32,
        }}
      >
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      <h3>장바구니</h3>
      {cart.length === 0 ? (
        <p>장바구니가 비어있어요.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onChangeQty={onChangeQty}
                onRemove={onRemove}
              />
            ))}
          </ul>
          <p style={{ fontWeight: 'bold', textAlign: 'right' }}>
            총 합계: {formatPrice(total)}
          </p>
          <div style={{ textAlign: 'right' }}>
            <button onClick={onCheckout}>결제하기</button>
          </div>
        </>
      )}
    </>
  );
}

// 2) 주문서 작성 화면 ---------------------------------------------------------

function CheckoutView({ cart, onPay, onCancel }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const total = cartTotal(cart);

  function handleSubmit(e) {
    e.preventDefault();
    setPaying(true);
    // 실제 결제 대신, 처리 중인 느낌만 흉내냄
    setTimeout(() => {
      onPay({ name, phone });
    }, 800);
  }

  return (
    <>
      <h3>주문/결제</h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cart.map((item) => (
          <li key={item.id} style={{ display: 'flex', marginBottom: 4 }}>
            <span style={{ flex: 1 }}>
              {item.emoji} {item.name} x {item.qty}
            </span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontWeight: 'bold', textAlign: 'right' }}>
        결제 금액: {formatPrice(total)}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            받는 분{' '}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={paying}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            연락처{' '}
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={paying}
            />
          </label>
        </div>
        <button type="button" onClick={onCancel} disabled={paying}>
          취소
        </button>{' '}
        <button type="submit" disabled={paying}>
          {paying ? '결제 처리 중...' : `${formatPrice(total)} 결제하기`}
        </button>
      </form>
    </>
  );
}

// 3) 결제 완료 화면 -----------------------------------------------------------

function CompleteView({ order, onContinueShopping }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>✅ 결제가 완료됐어요!</h3>
      <p>주문번호: {order.id}</p>
      <p>
        {order.name}님, {formatPrice(order.total)} 결제가 정상적으로 처리됐습니다.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'inline-block', textAlign: 'left' }}>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.emoji} {item.name} x {item.qty}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={onContinueShopping}>쇼핑 계속하기</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ShopPage() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('shopping'); // 'shopping' | 'checkout' | 'complete'
  const [order, setOrder] = useState(null);

  function handleAddToCart(product) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  }

  function handleChangeQty(id, delta) {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function handleRemove(id) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }

  function handlePay({ name }) {
    setOrder({
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      name,
      items: cart,
      total: cartTotal(cart),
    });
    setCart([]);
    setStep('complete');
  }

  function handleContinueShopping() {
    setOrder(null);
    setStep('shopping');
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'left' }}>
      <h2>미니 쇼핑몰</h2>

      {step === 'shopping' && (
        <ShoppingView
          cart={cart}
          onAddToCart={handleAddToCart}
          onChangeQty={handleChangeQty}
          onRemove={handleRemove}
          onCheckout={() => setStep('checkout')}
        />
      )}

      {step === 'checkout' && (
        <CheckoutView
          cart={cart}
          onPay={handlePay}
          onCancel={() => setStep('shopping')}
        />
      )}

      {step === 'complete' && (
        <CompleteView order={order} onContinueShopping={handleContinueShopping} />
      )}
    </div>
  );
}

export default ShopPage;
