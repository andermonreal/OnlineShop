import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const IMG_PLACEHOLDERS = [
  'linear-gradient(135deg,#e0f2fe,#bae6fd)',
  'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  'linear-gradient(135deg,#fef3c7,#fde68a)',
  'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'linear-gradient(135deg,#ede9fe,#ddd6fe)',
  'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
];

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  const bg = IMG_PLACEHOLDERS[product.id % IMG_PLACEHOLDERS.length];

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    setError(null);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card-shop h-100" style={{ display:'flex', flexDirection:'column' }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration:'none' }}>
        <div style={{
          height:'200px',
          background: product.imageUrl ? `url(${product.imageUrl}) center/cover no-repeat` : bg,
          position:'relative', flexShrink:0,
        }}>
          {!product.isAvailable() && (
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span className="badge-shop badge-danger" style={{ fontSize:'0.8rem', padding:'0.35rem 1rem' }}>Out of stock</span>
            </div>
          )}
          {product.isLowStock() && (
            <div style={{ position:'absolute', top:'0.6rem', right:'0.6rem' }}>
              <span className="badge-shop badge-warning">Only {product.quantity} left!</span>
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding:'1rem', display:'flex', flexDirection:'column', flex:1 }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration:'none' }}>
          <h5 style={{ fontFamily:'var(--font-head)', fontSize:'0.95rem', fontWeight:600, color:'var(--text-primary)', marginBottom:'0.3rem', lineHeight:1.3 }}>
            {product.name}
          </h5>
        </Link>

        {product.description && (
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.5, flex:1, marginBottom:'0.75rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {product.description}
          </p>
        )}

        <div style={{ marginTop:'auto' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', fontWeight:700, color:'var(--accent)' }}>
              {product.formattedPrice()}
            </span>
            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
              <i className="bi bi-box-seam me-1" />{product.quantity} in stock
            </span>
          </div>

          {error && <p style={{ fontSize:'0.75rem', color:'var(--danger)', marginBottom:'0.4rem' }}>{error}</p>}

          <button
            className="btn-primary-shop w-100"
            onClick={handleAdd}
            disabled={adding || !product.isAvailable()}
            style={{ justifyContent:'center' }}
          >
            {adding
              ? <span className="spinner-border spinner-border-sm" role="status" />
              : added
              ? <><i className="bi bi-check-lg" />Added!</>
              : <><i className="bi bi-cart-plus" />Add to cart</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
