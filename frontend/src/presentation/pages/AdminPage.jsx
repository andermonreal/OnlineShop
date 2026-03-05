import { useState, useEffect, useCallback } from 'react';
import { adminUseCases } from '../../application/usecases/AdminUseCases.js';
import { productUseCases } from '../../application/usecases/ProductUseCases.js';

const TABS = [
  { key:'users',    label:'Users',       icon:'bi-people-fill' },
  { key:'products', label:'Products',    icon:'bi-bag-fill' },
  { key:'add',      label:'Add product', icon:'bi-plus-circle-fill' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadU, setLoadU] = useState(false);
  const [loadP, setLoadP] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoadU(true);
    try { setUsers(await adminUseCases.getAllUsers()); }
    catch (e) { notify(e.message, 'danger'); }
    finally { setLoadU(false); }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadP(true);
    try { setProducts(await productUseCases.getAll()); }
    catch (e) { notify(e.message, 'danger'); }
    finally { setLoadP(false); }
  }, []);

  useEffect(() => { fetchUsers(); fetchProducts(); }, [fetchUsers, fetchProducts]);

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try { await adminUseCases.deleteUser(id); setUsers(u => u.filter(x => x.id !== id)); notify('User deleted'); }
    catch (e) { notify(e.message, 'danger'); }
  };

  const handleToggleRole = async (id) => {
    try { await adminUseCases.changeUserRole(id); await fetchUsers(); notify('Role updated'); }
    catch (e) { notify(e.message, 'danger'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await adminUseCases.deleteProduct(id); setProducts(p => p.filter(x => x.id !== id)); notify('Product deleted'); }
    catch (e) { notify(e.message, 'danger'); }
  };

  const handleAddProduct = async (data) => {
    await adminUseCases.addProduct(data);
    await fetchProducts();
    notify('Product added successfully');
    setTab('products');
  };

  const handleUpdateProduct = async (productId, data) => {
    await adminUseCases.updateProduct(productId, data);
    await fetchProducts();
    notify('Product updated successfully');
  };

  const handleChangeUserPw = async (userId, currentPassword, newPassword) => {
    await adminUseCases.changeUserPassword(userId, currentPassword, newPassword);
    notify('Password updated');
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid px-3 px-lg-4 py-4">

        <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <p className="section-tag mb-1">Control panel</p>
            <h1 style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', fontWeight:700, margin:0 }}>Administration</h1>
          </div>
          <button className="btn-secondary-shop" onClick={() => { fetchUsers(); fetchProducts(); }}>
            <i className="bi bi-arrow-clockwise" />Refresh
          </button>
        </div>

        {toast && (
          <div className={`alert-shop alert-${toast.type} mb-4`} style={{ animation:'fadeUp 0.3s ease' }}>
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />
            {toast.msg}
          </div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label:'Users',        value:users.length,                               icon:'bi-people-fill',       color:'var(--info)',    bg:'var(--info-bg)' },
            { label:'Products',     value:products.length,                            icon:'bi-bag-fill',          color:'var(--accent)',  bg:'var(--accent-bg)' },
            { label:'Admins',       value:users.filter(u => u.isAdmin()).length,      icon:'bi-shield-check-fill', color:'var(--success)', bg:'var(--success-bg)' },
            { label:'Out of stock', value:products.filter(p => !p.isAvailable()).length, icon:'bi-box-seam',       color:'var(--danger)',  bg:'var(--danger-bg)' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="col-6 col-lg-3">
              <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'1.1rem 1.25rem', boxShadow:'var(--shadow-xs)', display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ width:'42px', height:'42px', background:bg, borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <i className={`bi ${icon}`} style={{ fontSize:'1.1rem', color }} />
                </div>
                <div>
                  <p style={{ fontFamily:'var(--font-head)', fontSize:'1.6rem', fontWeight:700, color, margin:0, lineHeight:1 }}>{value}</p>
                  <p style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', margin:0, fontFamily:'var(--font-head)' }}>{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tab-nav">
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              <i className={`bi ${t.icon} me-2`} />{t.label}
            </button>
          ))}
        </div>

        {tab === 'users'    && <UsersTab    users={users}       loading={loadU} onDelete={handleDeleteUser}    onToggleRole={handleToggleRole}     onChangePassword={handleChangeUserPw} />}
        {tab === 'products' && <ProductsTab products={products} loading={loadP} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} />}
        {tab === 'add'      && <AddProductTab onAdd={handleAddProduct} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USERS TAB
───────────────────────────────────────────── */
function UsersTab({ users, loading, onDelete, onToggleRole, onChangePassword }) {
  const [pwModal, setPwModal] = useState(null);
  const [pwForm, setPwForm]   = useState({ current:'', newPw:'' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [search, setSearch]   = useState('');

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true); setPwError(null);
    try { await onChangePassword(pwModal.id, pwForm.current, pwForm.newPw); setPwModal(null); }
    catch (e) { setPwError(e.message); }
    finally { setPwLoading(false); }
  };

  if (loading) return <TableSkeleton cols={5} />;

  return (
    <>
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-xs)' }}>
        <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
            <i className="bi bi-search" style={{ position:'absolute', left:'0.8rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.85rem' }} />
            <input className="input-shop" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:'2.4rem' }} />
          </div>
          <span style={{ fontSize:'0.8rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="table-shop">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>#{u.id}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:`hsl(${(u.id * 47) % 360},60%,70%)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.75rem', fontWeight:700, fontFamily:'var(--font-head)', color:'#fff' }}>
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight:600, fontFamily:'var(--font-head)' }}>{u.name || <span style={{ color:'var(--text-muted)', fontStyle:'italic' }}>No name</span>}</span>
                    </div>
                  </td>
                  <td style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge-shop ${u.isAdmin() ? 'badge-admin' : 'badge-accent'}`}>
                      <i className={`bi ${u.isAdmin() ? 'bi-shield-check-fill' : 'bi-person-fill'} me-1`} />
                      {u.displayRole()}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      <button className="btn-secondary-shop" style={{ padding:'0.3rem 0.75rem', fontSize:'0.75rem' }} onClick={() => onToggleRole(u.id)}>
                        <i className="bi bi-arrow-repeat" />{u.isAdmin() ? 'Make customer' : 'Make admin'}
                      </button>
                      <button className="btn-ghost-shop" style={{ fontSize:'0.75rem' }} onClick={() => { setPwModal(u); setPwForm({ current:'', newPw:'' }); setPwError(null); }}>
                        <i className="bi bi-key" />Password
                      </button>
                      <button className="btn-danger-shop" style={{ padding:'0.3rem 0.75rem', fontSize:'0.75rem' }} onClick={() => onDelete(u.id)}>
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding:'2.5rem' }}>
              <div className="empty-icon"><i className="bi bi-people" /></div>
              <h4>{search ? 'No results' : 'No users found'}</h4>
            </div>
          )}
        </div>
      </div>

      {pwModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPwModal(null)}>
          <div className="modal-box">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h4 className="modal-title" style={{ margin:0 }}>
                <i className="bi bi-key-fill me-2" style={{ color:'var(--accent)' }} />Change password
              </h4>
              <button className="btn-ghost-shop" onClick={() => setPwModal(null)} style={{ padding:'0.3rem 0.5rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1.25rem' }}>
              Changing password for <strong>{pwModal.name || pwModal.email}</strong>
            </p>
            <form onSubmit={handlePwSubmit}>
              <div className="mb-3">
                <label className="label-shop">Your admin password</label>
                <input type="password" className="input-shop" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current:e.target.value })} required placeholder="Your admin password" autoFocus />
              </div>
              <div className="mb-4">
                <label className="label-shop">New password for user</label>
                <input type="password" className="input-shop" value={pwForm.newPw} onChange={e => setPwForm({ ...pwForm, newPw:e.target.value })} required minLength={6} placeholder="At least 6 characters" />
              </div>
              {pwError && <div className="alert-shop alert-danger mb-3"><i className="bi bi-exclamation-circle-fill" />{pwError}</div>}
              <div className="d-flex gap-2">
                <button type="submit" className="btn-primary-shop flex-fill" disabled={pwLoading} style={{ justifyContent:'center' }}>
                  {pwLoading ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><i className="bi bi-check-lg" />Save</>}
                </button>
                <button type="button" className="btn-secondary-shop" onClick={() => setPwModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   PRODUCTS TAB  (with View + Edit modals)
───────────────────────────────────────────── */
function ProductsTab({ products, loading, onDelete, onUpdate }) {
  const [search, setSearch]       = useState('');
  const [viewProduct, setView]    = useState(null);
  const [editProduct, setEdit]    = useState(null);
  const [editForm, setEditForm]   = useState({ price:'', quantity:'', description:'' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (p) => {
    setEdit(p);
    setEditForm({ price: String(p.price), quantity: String(p.quantity), description: p.description || '' });
    setEditError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true); setEditError(null);
    try {
      await onUpdate(editProduct.id, editForm);
      setEdit(null);
    } catch (e) { setEditError(e.message); }
    finally { setEditLoading(false); }
  };

  if (loading) return <TableSkeleton cols={6} />;

  return (
    <>
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-xs)' }}>
        <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
            <i className="bi bi-search" style={{ position:'absolute', left:'0.8rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.85rem' }} />
            <input className="input-shop" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:'2.4rem' }} />
          </div>
          <span style={{ fontSize:'0.8rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table className="table-shop">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>#{p.id}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'var(--r-sm)', flexShrink:0, overflow:'hidden', border:'1px solid var(--border)', background: p.imageUrl ? `url(${p.imageUrl}) center/cover` : 'linear-gradient(135deg,#e0f2fe,#bae6fd)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {!p.imageUrl && <i className="bi bi-bag" style={{ fontSize:'0.8rem', color:'var(--text-muted)' }} />}
                      </div>
                      <span style={{ fontWeight:600, fontFamily:'var(--font-head)', fontSize:'0.9rem' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'var(--accent)', whiteSpace:'nowrap' }}>{p.formattedPrice()}</td>
                  <td>
                    <span className={`badge-shop ${p.quantity === 0 ? 'badge-danger' : p.isLowStock() ? 'badge-warning' : 'badge-success'}`}>
                      {p.quantity === 0 ? 'Out of stock' : p.isLowStock() ? `Only ${p.quantity} left!` : `${p.quantity} units`}
                    </span>
                  </td>
                  <td style={{ color:'var(--text-secondary)', fontSize:'0.82rem', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {p.description || <span style={{ color:'var(--text-muted)', fontStyle:'italic' }}>—</span>}
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {/* VIEW */}
                      <button className="btn-ghost-shop" style={{ fontSize:'0.75rem', border:'1.5px solid var(--border)' }} onClick={() => setView(p)}>
                        <i className="bi bi-eye" />View
                      </button>
                      {/* EDIT */}
                      <button className="btn-secondary-shop" style={{ padding:'0.3rem 0.75rem', fontSize:'0.75rem' }} onClick={() => openEdit(p)}>
                        <i className="bi bi-pencil" />Edit
                      </button>
                      {/* DELETE */}
                      <button className="btn-danger-shop" style={{ padding:'0.3rem 0.75rem', fontSize:'0.75rem' }} onClick={() => onDelete(p.id)}>
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding:'2.5rem' }}>
              <div className="empty-icon"><i className="bi bi-bag" /></div>
              <h4>{search ? 'No results' : 'No products found'}</h4>
            </div>
          )}
        </div>
      </div>

      {/* ── VIEW MODAL ─────────────────────────── */}
      {viewProduct && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setView(null)}>
          <div className="modal-box" style={{ maxWidth:'520px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="modal-title" style={{ margin:0 }}>
                <i className="bi bi-eye-fill me-2" style={{ color:'var(--accent)' }} />Product details
              </h4>
              <button className="btn-ghost-shop" onClick={() => setView(null)} style={{ padding:'0.3rem 0.5rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {/* Image */}
            <div style={{
              width:'100%', height:'180px', borderRadius:'var(--r-lg)', marginBottom:'1.25rem',
              background: viewProduct.imageUrl ? `url(${viewProduct.imageUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
              border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {!viewProduct.imageUrl && <i className="bi bi-image" style={{ fontSize:'2.5rem', color:'var(--text-muted)', opacity:0.4 }} />}
            </div>

            {/* Fields */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {[
                { label:'ID',          value:`#${viewProduct.id}` },
                { label:'Name',        value:viewProduct.name },
                { label:'Price',       value:viewProduct.formattedPrice() },
                { label:'Stock',       value:`${viewProduct.quantity} units` },
                { label:'Created',     value:viewProduct.createdAt ? new Date(viewProduct.createdAt).toLocaleString('en-US') : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display:'flex', gap:'0.75rem', alignItems:'baseline' }}>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, fontFamily:'var(--font-head)', color:'var(--text-muted)', minWidth:'72px', flexShrink:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</span>
                  <span style={{ fontSize:'0.875rem', color:'var(--text-primary)', fontWeight:500, wordBreak:'break-all' }}>{value}</span>
                </div>
              ))}
              {viewProduct.description && (
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, fontFamily:'var(--font-head)', color:'var(--text-muted)', minWidth:'72px', flexShrink:0, textTransform:'uppercase', letterSpacing:'0.05em', paddingTop:'0.1rem' }}>Description</span>
                  <span style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{viewProduct.description}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop:'1.5rem', display:'flex', gap:'0.5rem' }}>
              <button className="btn-primary-shop" onClick={() => { setView(null); openEdit(viewProduct); }}>
                <i className="bi bi-pencil" />Edit product
              </button>
              <button className="btn-secondary-shop" onClick={() => setView(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ─────────────────────────── */}
      {editProduct && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEdit(null)}>
          <div className="modal-box" style={{ maxWidth:'480px' }}>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h4 className="modal-title" style={{ margin:0 }}>
                <i className="bi bi-pencil-fill me-2" style={{ color:'var(--accent)' }} />Edit product
              </h4>
              <button className="btn-ghost-shop" onClick={() => setEdit(null)} style={{ padding:'0.3rem 0.5rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1.25rem' }}>
              Editing <strong>{editProduct.name}</strong> — only changed fields will be sent.
            </p>

            <form onSubmit={handleEditSubmit}>
              {/* Price */}
              <div className="mb-3">
                <label className="label-shop">Price ($)</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.9rem', pointerEvents:'none' }}>$</span>
                  <input
                    type="number"
                    className="input-shop"
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    min="0.01" step="0.01"
                    placeholder={String(editProduct.price)}
                    style={{ paddingLeft:'1.8rem' }}
                  />
                </div>
                <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>Current: {editProduct.formattedPrice()}</p>
              </div>

              {/* Stock */}
              <div className="mb-3">
                <label className="label-shop">Stock quantity</label>
                <input
                  type="number"
                  className="input-shop"
                  value={editForm.quantity}
                  onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                  min="0"
                  placeholder={String(editProduct.quantity)}
                />
                <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>Current: {editProduct.quantity} units</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="label-shop">Description</label>
                <textarea
                  className="input-shop"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  placeholder="Product description..."
                  style={{ resize:'vertical', lineHeight:1.6 }}
                />
              </div>

              {editError && <div className="alert-shop alert-danger mb-3"><i className="bi bi-exclamation-circle-fill" />{editError}</div>}

              <div className="d-flex gap-2">
                <button type="submit" className="btn-primary-shop flex-fill" disabled={editLoading} style={{ justifyContent:'center' }}>
                  {editLoading ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><i className="bi bi-check-lg" />Save changes</>}
                </button>
                <button type="button" className="btn-secondary-shop" onClick={() => setEdit(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   ADD PRODUCT TAB
───────────────────────────────────────────── */
function AddProductTab({ onAdd }) {
  const [form, setForm]     = useState({ name:'', description:'', price:'', quantity:'', imageUrl:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try { await onAdd(form); setForm({ name:'', description:'', price:'', quantity:'', imageUrl:'' }); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:'640px' }}>
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'2rem', boxShadow:'var(--shadow-xs)' }}>
        <h4 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.1rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <i className="bi bi-plus-circle-fill" style={{ color:'var(--accent)' }} />New product
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="label-shop">Product name *</label>
              <input name="name" className="input-shop" value={form.name} onChange={handle} required placeholder="Product name" autoFocus />
            </div>
            <div className="col-12">
              <label className="label-shop">Description</label>
              <textarea name="description" className="input-shop" value={form.description} onChange={handle} rows={3}
                placeholder="Optional product description..." style={{ resize:'vertical', lineHeight:1.6 }} />
            </div>
            <div className="col-sm-6">
              <label className="label-shop">Price ($) *</label>
              <input name="price" type="number" className="input-shop" value={form.price} onChange={handle} required min="0.01" step="0.01" placeholder="0.00" />
            </div>
            <div className="col-sm-6">
              <label className="label-shop">Stock quantity</label>
              <input name="quantity" type="number" className="input-shop" value={form.quantity} onChange={handle} min="0" placeholder="0" />
            </div>
            <div className="col-12">
              <label className="label-shop">Image URL</label>
              <input name="imageUrl" type="url" className="input-shop" value={form.imageUrl} onChange={handle} placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          {form.imageUrl && (
            <div style={{ marginTop:'1rem' }}>
              <label className="label-shop">Preview</label>
              <div style={{ width:'80px', height:'80px', borderRadius:'var(--r-md)', border:'1px solid var(--border)', background:`url(${form.imageUrl}) center/cover` }} />
            </div>
          )}
          {error && <div className="alert-shop alert-danger mt-3"><i className="bi bi-exclamation-circle-fill" />{error}</div>}
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn-primary-shop" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm" />Adding...</> : <><i className="bi bi-plus-lg" />Add product</>}
            </button>
            <button type="button" className="btn-secondary-shop" onClick={() => setForm({ name:'', description:'', price:'', quantity:'', imageUrl:'' })}>
              <i className="bi bi-x-circle" />Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TableSkeleton({ cols }) {
  return (
    <div style={{ padding:'1rem' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ display:'flex', gap:'1rem', marginBottom:'0.6rem' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="shimmer flex-fill" style={{ height:'44px' }} />
          ))}
        </div>
      ))}
    </div>
  );
}
