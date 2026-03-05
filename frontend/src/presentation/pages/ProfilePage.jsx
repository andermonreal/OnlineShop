import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState({ current:'', newPw:'', confirm:'' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) { setPwError('Passwords do not match'); return; }
    setPwLoading(true); setPwError(null); setPwSuccess(false);
    try {
      await changePassword(pw.current, pw.newPw);
      setPwSuccess(true);
      setPw({ current:'', newPw:'', confirm:'' });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <div className="page-wrapper">
      <div className="container px-3 px-lg-4 py-4" style={{ maxWidth:'780px' }}>
        <p className="section-tag mb-1">Settings</p>
        <h1 style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', fontWeight:700, marginBottom:'1.75rem' }}>My account</h1>

        {/* Profile info */}
        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'1.5rem', marginBottom:'1.25rem', boxShadow:'var(--shadow-xs)' }}>
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div style={{ width:'70px', height:'70px', borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent-light))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(13,115,119,0.3)' }}>
              <span style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', fontWeight:700, color:'#fff' }}>{initial}</span>
            </div>
            <div style={{ flex:1 }}>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', fontWeight:700, margin:0 }}>{user?.name || 'No name'}</h3>
                <span className={`badge-shop ${user?.isAdmin() ? 'badge-admin' : 'badge-accent'}`}>
                  <i className={`bi ${user?.isAdmin() ? 'bi-shield-check-fill' : 'bi-person-fill'} me-1`} />
                  {user?.displayRole()}
                </span>
              </div>
              <p style={{ fontSize:'0.875rem', color:'var(--text-secondary)', margin:0 }}>{user?.email}</p>
            </div>
            {user?.isAdmin() && (
              <button className="btn-primary-shop" onClick={() => navigate('/admin')}>
                <i className="bi bi-shield-check" />Admin panel
              </button>
            )}
          </div>

          <div className="divider-shop" />
          <div className="row g-3">
            {[
              { label:'User ID',  value:`#${user?.id}`,      icon:'bi-hash' },
              { label:'Email',    value:user?.email,          icon:'bi-envelope' },
              { label:'Role',     value:user?.displayRole(),  icon:'bi-person-badge' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="col-sm-4">
                <div style={{ background:'var(--bg-subtle)', borderRadius:'var(--r-md)', padding:'0.75rem 1rem' }}>
                  <p style={{ fontSize:'0.72rem', fontWeight:700, fontFamily:'var(--font-head)', color:'var(--text-muted)', marginBottom:'0.2rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                    <i className={`bi ${icon}`} />{label}
                  </p>
                  <p style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--text-primary)', margin:0, overflow:'hidden', textOverflow:'ellipsis' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change password */}
        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'1.5rem', marginBottom:'1.25rem', boxShadow:'var(--shadow-xs)' }}>
          <h4 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.05rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <i className="bi bi-key-fill" style={{ color:'var(--accent)' }} />Change password
          </h4>
          <form onSubmit={handlePwSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="label-shop">Current password</label>
                <input type="password" className="input-shop" value={pw.current}
                  onChange={e => setPw({ ...pw, current:e.target.value })} required placeholder="Your current password" />
              </div>
              <div className="col-sm-6">
                <label className="label-shop">New password</label>
                <input type="password" className="input-shop" value={pw.newPw}
                  onChange={e => setPw({ ...pw, newPw:e.target.value })} required minLength={6} placeholder="At least 6 characters" />
              </div>
              <div className="col-sm-6">
                <label className="label-shop">Confirm new password</label>
                <input type="password" className="input-shop" value={pw.confirm}
                  onChange={e => setPw({ ...pw, confirm:e.target.value })} required placeholder="Repeat your new password" />
              </div>
            </div>
            {pwError   && <div className="alert-shop alert-danger  mt-3"><i className="bi bi-exclamation-circle-fill" />{pwError}</div>}
            {pwSuccess && <div className="alert-shop alert-success mt-3"><i className="bi bi-check-circle-fill" />Password updated successfully.</div>}
            <button type="submit" className="btn-primary-shop mt-3" disabled={pwLoading}>
              {pwLoading ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><i className="bi bi-check-lg" />Save new password</>}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div style={{ background:'var(--bg-surface)', border:'1px solid #fca5a5', borderRadius:'var(--r-xl)', padding:'1.25rem 1.5rem', boxShadow:'var(--shadow-xs)' }}>
          <h4 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1rem', color:'var(--danger)', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <i className="bi bi-exclamation-triangle-fill" />Danger zone
          </h4>
          <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem' }}>Sign out from all devices.</p>
          <button className="btn-danger-shop" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
