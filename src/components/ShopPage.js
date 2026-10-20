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

function ShopPage() {
  const [cart, setCart] = useState([]);

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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'left' }}>
      <h2>미니 쇼핑몰</h2>

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
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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
                onChangeQty={handleChangeQty}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <p style={{ fontWeight: 'bold', textAlign: 'right' }}>
            총 합계: {formatPrice(total)}
          </p>
        </>
      )}
    </div>
  );
}

export default ShopPage;
