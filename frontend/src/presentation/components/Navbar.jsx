import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      background:'var(--bg-surface)',
      borderBottom:`1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition:'all 0.3s ease',
      height:'68px',
    }}>
      <div className="container-fluid px-3 px-lg-4 h-100 d-flex align-items-center justify-content-between">

        <Link to="/" style={{
          fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.35rem',
          color:'var(--text-primary)', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem',
        }}>
          <div style={{ width:'32px', height:'32px', background:'var(--accent)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className="bi bi-bag-fill" style={{ color:'#fff', fontSize:'0.95rem' }} />
          </div>
          Online<span style={{ color:'var(--accent)' }}>Shop</span>
        </Link>

        {user && (
          <div className="d-none d-md-flex align-items-center gap-1">
            <NavItem to="/"        label="Products"       icon="bi-grid" />
            <NavItem to="/cart"    label="Cart"           icon="bi-bag"           badge={cartCount} />
            <NavItem to="/profile" label="My Account"     icon="bi-person" />
            {user.isAdmin() && <NavItem to="/admin" label="Admin" icon="bi-shield-check" highlight />}
          </div>
        )}

        <div className="d-none d-md-flex align-items-center gap-2">
          {user ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.35rem 0.8rem', background:'var(--bg-subtle)', borderRadius:'var(--r-full)', fontSize:'0.82rem' }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.72rem', fontWeight:700, fontFamily:'var(--font-head)' }}>
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span style={{ color:'var(--text-secondary)', fontWeight:500 }}>{user.name?.split(' ')[0] || user.email}</span>
                {user.isAdmin() && <span className="badge-shop badge-admin">Admin</span>}
              </div>
              <button className="btn-secondary-shop" onClick={handleLogout} style={{ padding:'0.45rem 1rem', fontSize:'0.82rem' }}>
                <i className="bi bi-box-arrow-right" />Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-secondary-shop">Sign in</Link>
              <Link to="/register" className="btn-primary-shop">Sign up</Link>
            </>
          )}
        </div>

        <button className="d-md-none btn-ghost-shop" onClick={() => setMobileOpen(!mobileOpen)} style={{ position:'relative' }}>
          <i className={`bi bi-${mobileOpen ? 'x-lg' : 'list'}`} style={{ fontSize:'1.3rem' }} />
          {cartCount > 0 && !mobileOpen && (
            <span style={{ position:'absolute', top:2, right:2, background:'var(--accent)', color:'#fff', width:'14px', height:'14px', borderRadius:'50%', fontSize:'0.6rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</span>
          )}
        </button>
      </div>

      {mobileOpen && user && (
        <div style={{ background:'var(--bg-surface)', borderTop:'1px solid var(--border)', padding:'0.75rem 1rem', boxShadow:'var(--shadow-md)', animation:'fadeUp 0.2s ease' }}>
          {[
            { to:'/', label:'Products', icon:'bi-grid' },
            { to:'/cart', label:`Cart (${cartCount})`, icon:'bi-bag' },
            { to:'/profile', label:'My Account', icon:'bi-person' },
            ...(user.isAdmin() ? [{ to:'/admin', label:'Admin Panel', icon:'bi-shield-check' }] : []),
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.65rem 0.5rem', color:'var(--text-primary)', fontSize:'0.9rem', borderRadius:'var(--r-md)', fontWeight:500, textDecoration:'none' }}>
              <i className={`bi ${icon}`} style={{ color:'var(--accent)', fontSize:'1rem' }} />{label}
            </Link>
          ))}
          <div className="divider-shop" style={{ margin:'0.5rem 0' }} />
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.65rem 0.5rem', color:'var(--danger)', fontSize:'0.875rem', background:'none', border:'none', cursor:'pointer', width:'100%', borderRadius:'var(--r-md)' }}>
            <i className="bi bi-box-arrow-right" />Sign out
          </button>
        </div>
      )}
    </nav>
  );
}

function NavItem({ to, label, icon, badge, highlight }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} style={{
      display:'flex', alignItems:'center', gap:'0.35rem',
      padding:'0.45rem 0.85rem', borderRadius:'var(--r-md)',
      fontSize:'0.875rem', fontWeight:600, fontFamily:'var(--font-head)',
      color: active ? 'var(--accent)' : highlight ? 'var(--info)' : 'var(--text-secondary)',
      background: active ? 'var(--accent-bg)' : 'transparent',
      textDecoration:'none', transition:'all var(--t)', position:'relative',
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.color='var(--text-primary)'; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=highlight?'var(--info)':'var(--text-secondary)'; } }}
    >
      <i className={`bi ${icon}`} />
      {label}
      {badge > 0 && (
        <span style={{ background:'var(--accent)', color:'#fff', minWidth:'18px', height:'18px', borderRadius:'var(--r-full)', fontSize:'0.65rem', fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}>{badge}</span>
      )}
    </Link>
  );
}
