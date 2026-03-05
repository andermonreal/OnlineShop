import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const { cart, loading, cartCount, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [busyMap, setBusyMap] = useState({});
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);

  const setB = (key, val) => setBusyMap(m => ({ ...m, [key]: val }));
  const notify = (msg) => { setError(msg); setTimeout(() => setError(null), 4000); };

  const handleDecrease = async (item) => {
    setB(`dec_${item.id}`, true);
    try {
      if (item.quantity <= 0) await removeFromCart(item.product.id);
      else await decreaseQuantity(item.product.id, 1);
    } catch (e) { notify(e.message); }
    finally { setB(`dec_${item.id}`, false); }
  };

  const handleIncrease = async (item) => {
    setB(`inc_${item.id}`, true);
    try { await addToCart(item.product.id, 1); }
    catch (e) { notify(e.message); }
    finally { setB(`inc_${item.id}`, false); }
  };

  const handleRemove = async (item) => {
    setB(`rm_${item.id}`, true);
    try { await removeFromCart(item.product.id); }
    catch (e) { notify(e.message); }
    finally { setB(`rm_${item.id}`, false); }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    setClearing(true);
    try { await clearCart(); }
    catch (e) { notify(e.message); }
    finally { setClearing(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container px-3 px-lg-4 py-4">

        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <p className="section-tag mb-1">My order</p>
            <h1 style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', fontWeight:700, margin:0 }}>
              Cart
              {cartCount > 0 && (
                <span style={{ fontSize:'1rem', color:'var(--text-muted)', fontWeight:400, marginLeft:'0.5rem' }}>
                  — {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
          </div>
          {cart?.orderItems?.length > 0 && (
            <button className="btn-danger-shop" onClick={handleClear} disabled={clearing}>
              {clearing ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-trash3" />}
              Clear cart
            </button>
          )}
        </div>

        {error && <div className="alert-shop alert-danger mb-3"><i className="bi bi-exclamation-circle-fill" />{error}</div>}

        {loading && (
          <div className="page-loader" style={{ minHeight:'40vh' }}>
            <div className="spinner-shop" /><span>Loading cart...</span>
          </div>
        )}

        {!loading && (!cart || cart.orderItems.length === 0) && (
          <div className="empty-state">
            <div className="empty-icon"><i className="bi bi-cart-x" /></div>
            <h4>Your cart is empty</h4>
            <p>Add products from the catalog to get started.</p>
            <button className="btn-primary-shop mt-3" onClick={() => navigate('/')}>
              <i className="bi bi-grid" />Browse products
            </button>
          </div>
        )}

        {!loading && cart && cart.orderItems.length > 0 && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {cart.orderItems.map((item, i) => {
                  const anyBusy = busyMap[`dec_${item.id}`] || busyMap[`inc_${item.id}`] || busyMap[`rm_${item.id}`];
                  return (
                    <div key={item.id} className="card-shop" style={{ padding:'1rem', animation:`fadeUp 0.3s ${i*0.06}s both`, opacity:anyBusy?0.6:1, transition:'opacity 0.2s' }}>
                      <div className="d-flex gap-3 align-items-center">
                        <div style={{
                          width:'80px', height:'80px', flexShrink:0, borderRadius:'var(--r-md)', border:'1px solid var(--border)',
                          background: item.product.imageUrl ? `url(${item.product.imageUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          {!item.product.imageUrl && <i className="bi bi-bag" style={{ fontSize:'1.5rem', color:'var(--text-muted)' }} />}
                        </div>

                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontFamily:'var(--font-head)', fontWeight:600, fontSize:'0.95rem', marginBottom:'0.15rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {item.product.name}
                          </p>
                          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'0.65rem' }}>
                            {item.product.formattedPrice()} each
                          </p>
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => handleDecrease(item)} disabled={!!anyBusy}
                              title={item.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}>
                              {busyMap[`dec_${item.id}`]
                                ? <span className="spinner-border spinner-border-sm" style={{ width:'11px', height:'11px' }} />
                                : item.quantity <= 1 ? <i className="bi bi-trash3" style={{ fontSize:'0.7rem' }} /> : '−'}
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => handleIncrease(item)} disabled={!!anyBusy}>
                              {busyMap[`inc_${item.id}`]
                                ? <span className="spinner-border spinner-border-sm" style={{ width:'11px', height:'11px' }} />
                                : '+'}
                            </button>
                          </div>
                        </div>

                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <p style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.05rem', color:'var(--accent)', marginBottom:'0.5rem' }}>
                            {item.formattedSubtotal()}
                          </p>
                          <button className="btn-danger-shop" onClick={() => handleRemove(item)} disabled={!!anyBusy} style={{ padding:'0.3rem 0.75rem', fontSize:'0.75rem' }}>
                            {busyMap[`rm_${item.id}`] ? <span className="spinner-border spinner-border-sm" style={{ width:'11px', height:'11px' }} /> : <i className="bi bi-x-lg" />}
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {cart.status && (
                <p style={{ marginTop:'0.75rem', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                  Order status:{' '}
                  <span className={`badge-shop ${cart.status==='active'?'badge-accent':cart.status==='completed'?'badge-success':'badge-neutral'}`}>
                    {cart.status==='active'?'Active':cart.status==='completed'?'Completed':'Cancelled'}
                  </span>
                </p>
              )}
            </div>

            <div className="col-lg-4">
              <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'1.5rem', boxShadow:'var(--shadow-sm)', position:'sticky', top:'80px' }}>
                <h4 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.1rem', marginBottom:'1.25rem' }}>Order summary</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem' }}>
                  {cart.orderItems.map(item => (
                    <div key={item.id} className="d-flex justify-content-between" style={{ fontSize:'0.82rem' }}>
                      <span style={{ color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'65%' }}>
                        {item.product.name} <span style={{ color:'var(--text-muted)' }}>×{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight:600, flexShrink:0 }}>{item.formattedSubtotal()}</span>
                    </div>
                  ))}
                </div>
                <div className="divider-shop" />
                <div className="d-flex justify-content-between mb-2" style={{ fontSize:'0.875rem' }}>
                  <span style={{ color:'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight:600 }}>{cart.formattedTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-4" style={{ fontSize:'0.875rem' }}>
                  <span style={{ color:'var(--text-secondary)' }}>Shipping</span>
                  <span className="badge-shop badge-success">Free</span>
                </div>
                <div style={{ background:'var(--accent-bg)', border:'1px solid var(--accent-border)', borderRadius:'var(--r-lg)', padding:'0.9rem 1rem', marginBottom:'1.25rem' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:700 }}>Total</span>
                    <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.4rem', color:'var(--accent)' }}>{cart.formattedTotal()}</span>
                  </div>
                </div>
                <button className="btn-primary-shop w-100 mb-2" style={{ justifyContent:'center', padding:'0.72rem', fontSize:'0.95rem' }}>
                  <i className="bi bi-credit-card" />Proceed to checkout
                </button>
                <button className="btn-ghost-shop w-100" onClick={() => navigate('/')} style={{ justifyContent:'center' }}>
                  <i className="bi bi-arrow-left" />Continue shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
