import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg-base)' }}>
      {/* Left branding panel */}
      <div className="d-none d-lg-flex" style={{
        width:'44%', background:'var(--accent)',
        flexDirection:'column', justifyContent:'space-between',
        padding:'3rem', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'320px', height:'320px', background:'rgba(255,255,255,0.06)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'260px', height:'260px', background:'rgba(255,255,255,0.06)', borderRadius:'50%' }} />

        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:'38px', height:'38px', background:'rgba(255,255,255,0.2)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className="bi bi-bag-fill" style={{ color:'#fff', fontSize:'1.1rem' }} />
          </div>
          <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.4rem', color:'#fff' }}>OnlineShop</span>
        </div>

        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2.4rem', fontWeight:700, color:'#fff', lineHeight:1.2, marginBottom:'1rem' }}>
            Your trusted online store
          </h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1rem', lineHeight:1.7 }}>
            Thousands of products at your fingertips. Shop easily, quickly and securely.
          </p>
          <div style={{ display:'flex', gap:'2rem', marginTop:'2rem' }}>
            {[['bi-shield-check','Secure'],['bi-truck','Fast shipping'],['bi-arrow-repeat','Easy returns']].map(([icon,label])=>(
              <div key={label} style={{ textAlign:'center' }}>
                <i className={`bi ${icon}`} style={{ color:'rgba(255,255,255,0.85)', fontSize:'1.4rem', display:'block', marginBottom:'0.25rem' }} />
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.75rem', fontWeight:600, fontFamily:'var(--font-head)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <div className="fade-up" style={{ width:'100%', maxWidth:'400px' }}>
          <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
            <div style={{ width:'32px', height:'32px', background:'var(--accent)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="bi bi-bag-fill" style={{ color:'#fff' }} />
            </div>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.2rem' }}>OnlineShop</span>
          </div>

          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.75rem', fontWeight:700, marginBottom:'0.35rem' }}>
            Sign in
          </h2>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'1.75rem' }}>
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="label-shop">Email</label>
              <input type="email" className="input-shop" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required autoFocus />
            </div>
            <div className="mb-4">
              <label className="label-shop">Password</label>
              <input type="password" className="input-shop" placeholder="Your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            {error && (
              <div className="alert-shop alert-danger mb-3">
                <i className="bi bi-exclamation-circle-fill" />{error}
              </div>
            )}

            <button type="submit" className="btn-primary-shop w-100" disabled={loading} style={{ justifyContent:'center', padding:'0.7rem' }}>
              {loading ? <><span className="spinner-border spinner-border-sm" />Signing in...</> : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--accent)', fontWeight:600 }}>Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
