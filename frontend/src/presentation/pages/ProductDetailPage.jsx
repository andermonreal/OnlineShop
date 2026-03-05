import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productUseCases } from '../../application/usecases/ProductUseCases.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    productUseCases.getById(Number(id))
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    setAdding(true); setCartError(null);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (e) {
      setCartError(e.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="page-loader"><div className="spinner-shop" /><span>Loading product...</span></div>
    </div>
  );

  if (error || !product) return (
    <div className="page-wrapper">
      <div className="empty-state">
        <div className="empty-icon"><i className="bi bi-exclamation-circle" /></div>
        <h4>Product not found</h4>
        <p>{error}</p>
        <button className="btn-primary-shop mt-3" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left" />Back to catalog
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container px-3 px-lg-4 py-4">
        <nav style={{ marginBottom:'1.5rem' }}>
          <button className="btn-ghost-shop" onClick={() => navigate('/')} style={{ paddingLeft:0 }}>
            <i className="bi bi-arrow-left" />Back to catalog
          </button>
        </nav>

        <div className="row g-4 g-lg-5">
          <div className="col-md-5">
            <div style={{
              borderRadius:'var(--r-xl)', overflow:'hidden',
              border:'1px solid var(--border)', aspectRatio:'1/1',
              background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'var(--shadow-sm)',
            }}>
              {!product.imageUrl && <i className="bi bi-image" style={{ fontSize:'4rem', color:'var(--text-muted)', opacity:0.4 }} />}
            </div>
          </div>

          <div className="col-md-7 d-flex flex-column justify-content-start" style={{ paddingTop:'0.5rem' }}>
            <h1 style={{ fontFamily:'var(--font-head)', fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:700, marginBottom:'0.5rem' }}>
              {product.name}
            </h1>

            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <span style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:700, color:'var(--accent)' }}>
                {product.formattedPrice()}
              </span>
              {product.isLowStock()   && <span className="badge-shop badge-warning">Only {product.quantity} left!</span>}
              {!product.isAvailable() && <span className="badge-shop badge-danger">Out of stock</span>}
              {product.isAvailable() && !product.isLowStock() && (
                <span className="badge-shop badge-success"><i className="bi bi-check-circle-fill" />In stock ({product.quantity})</span>
              )}
            </div>

            {product.description && (
              <p style={{ color:'var(--text-secondary)', lineHeight:1.75, fontSize:'0.95rem', marginBottom:'1.5rem' }}>
                {product.description}
              </p>
            )}

            <div className="divider-shop" />

            {product.isAvailable() ? (
              <>
                <div className="mb-4">
                  <label className="label-shop mb-2">Quantity</label>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))} disabled={qty <= 1}>−</button>
                    <span className="qty-value">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => Math.min(product.quantity, q+1))} disabled={qty >= product.quantity}>+</button>
                  </div>
                </div>

                {cartError && <div className="alert-shop alert-danger mb-3"><i className="bi bi-exclamation-circle-fill" />{cartError}</div>}

                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn-primary-shop" onClick={handleAdd} disabled={adding} style={{ flex:1, justifyContent:'center', padding:'0.75rem' }}>
                    {adding  ? <><span className="spinner-border spinner-border-sm" />Adding...</>
                    : added  ? <><i className="bi bi-check-lg" />Added to cart!</>
                    :          <><i className="bi bi-cart-plus" />Add to cart</>}
                  </button>
                  <button className="btn-secondary-shop" onClick={() => navigate('/cart')} style={{ padding:'0.75rem 1.25rem' }}>
                    <i className="bi bi-bag" />View cart
                  </button>
                </div>
              </>
            ) : (
              <div className="alert-shop alert-danger">
                <i className="bi bi-x-circle-fill" />This product is currently unavailable.
              </div>
            )}

            <div className="d-flex flex-wrap gap-3 mt-4">
              {[['bi-shield-check','Secure checkout'],['bi-truck','Fast shipping'],['bi-arrow-counterclockwise','Easy returns']].map(([icon,label]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                  <i className={`bi ${icon}`} style={{ color:'var(--accent)' }} />{label}
                </div>
              ))}
            </div>

            <div style={{ marginTop:'1.5rem', background:'var(--bg-subtle)', borderRadius:'var(--r-lg)', padding:'1rem 1.25rem' }}>
              <p className="label-shop mb-2">Product details</p>
              <div className="row g-2">
                <div className="col-6"><span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>ID:</span> <span style={{ fontSize:'0.8rem', fontWeight:600 }}>#{product.id}</span></div>
                <div className="col-6"><span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Stock:</span> <span style={{ fontSize:'0.8rem', fontWeight:600 }}>{product.quantity} units</span></div>
                {product.createdAt && (
                  <div className="col-12"><span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Added:</span> <span style={{ fontSize:'0.8rem', fontWeight:600 }}>{new Date(product.createdAt).toLocaleDateString('en-US')}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
