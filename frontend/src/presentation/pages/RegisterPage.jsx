import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError(null);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg-base)' }}>
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
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', fontWeight:700, color:'#fff', lineHeight:1.25, marginBottom:'1rem' }}>
            Join our community
          </h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1rem', lineHeight:1.7 }}>
            Create your free account and start shopping thousands of products today.
          </p>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <div className="fade-up" style={{ width:'100%', maxWidth:'420px' }}>
          <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
            <div style={{ width:'32px', height:'32px', background:'var(--accent)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="bi bi-bag-fill" style={{ color:'#fff' }} />
            </div>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.2rem' }}>OnlineShop</span>
          </div>

          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.75rem', fontWeight:700, marginBottom:'0.35rem' }}>Create account</h2>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'1.75rem' }}>Fill in the form to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="label-shop">Full name</label>
              <input type="text" className="input-shop" placeholder="Your name" value={form.name}
                onChange={e => setForm({ ...form, name:e.target.value })} required autoFocus />
            </div>
            <div className="mb-3">
              <label className="label-shop">Email</label>
              <input type="email" className="input-shop" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email:e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="label-shop">Password</label>
              <input type="password" className="input-shop" placeholder="At least 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password:e.target.value })} required minLength={6} />
            </div>
            <div className="mb-4">
              <label className="label-shop">Confirm password</label>
              <input type="password" className="input-shop" placeholder="Repeat your password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm:e.target.value })} required />
            </div>

            {error && <div className="alert-shop alert-danger mb-3"><i className="bi bi-exclamation-circle-fill" />{error}</div>}

            <button type="submit" className="btn-primary-shop w-100" disabled={loading} style={{ justifyContent:'center', padding:'0.7rem' }}>
              {loading ? <><span className="spinner-border spinner-border-sm" />Creating account...</> : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--accent)', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
