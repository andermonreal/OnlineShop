import { useState, useEffect } from 'react';
import { productUseCases } from '../../application/usecases/ProductUseCases.js';
import ProductCard from '../components/ProductCard.jsx';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    productUseCases.getAll()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  let filtered = productUseCases.search(products, search);
  filtered = productUseCases.filterAvailable(filtered, onlyAvailable);
  filtered = productUseCases.sort(filtered, sort);

  return (
    <div className="page-wrapper">
      <div className="container px-3 px-lg-4 py-4">

        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <p className="section-tag mb-1">Catalog</p>
            <h1 style={{ fontFamily:'var(--font-head)', fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700, margin:0 }}>
              All products
            </h1>
          </div>
          {!loading && (
            <span style={{ fontSize:'0.82rem', color:'var(--text-muted)', background:'var(--bg-subtle)', padding:'0.3rem 0.8rem', borderRadius:'var(--r-full)', fontWeight:500 }}>
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {/* Filters */}
        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'1rem 1.25rem', marginBottom:'1.75rem', boxShadow:'var(--shadow-xs)' }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div style={{ position:'relative' }}>
                <i className="bi bi-search" style={{ position:'absolute', left:'0.8rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.9rem' }} />
                <input className="input-shop" type="text" placeholder="Search by name or description..."
                  value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:'2.4rem' }} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="input-shop" value={sort} onChange={e => setSort(e.target.value)} style={{ cursor:'pointer' }}>
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name A–Z</option>
                <option value="stock-asc">Stock: least first</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-center gap-2">
              <input type="checkbox" id="avail" checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
                style={{ width:'16px', height:'16px', accentColor:'var(--accent)', cursor:'pointer' }} />
              <label htmlFor="avail" style={{ fontSize:'0.875rem', color:'var(--text-secondary)', cursor:'pointer', marginBottom:0, userSelect:'none' }}>
                In stock only
              </label>
            </div>
          </div>
        </div>

        {loading && <ProductGrid loading />}

        {error && (
          <div className="alert-shop alert-danger">
            <i className="bi bi-exclamation-triangle-fill" />{error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><i className="bi bi-search" /></div>
            <h4>No results found</h4>
            <p>Try a different search term or clear the filters.</p>
            <button className="btn-secondary-shop mt-3" onClick={() => { setSearch(''); setOnlyAvailable(false); setSort('default'); }}>
              <i className="bi bi-x-circle" />Clear filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ProductGrid products={filtered} />
        )}
      </div>
    </div>
  );
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="row g-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col-6 col-sm-4 col-lg-3">
            <div className="card-shop">
              <div className="shimmer" style={{ height:'200px', borderRadius:0 }} />
              <div style={{ padding:'1rem' }}>
                <div className="shimmer mb-2" style={{ height:'16px', width:'75%' }} />
                <div className="shimmer mb-3" style={{ height:'13px', width:'55%' }} />
                <div className="shimmer" style={{ height:'36px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="row g-3">
      {products.map((p, i) => (
        <div key={p.id} className="col-6 col-sm-4 col-lg-3" style={{ animation:`fadeUp 0.35s ${i*0.04}s both` }}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
