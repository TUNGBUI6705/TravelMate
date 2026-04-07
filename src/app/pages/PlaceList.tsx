import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Download, Plus, LayoutGrid, LayoutList, MoreVertical, Star, Eye, Edit, Trash2, MapPin, X } from 'lucide-react';
import { mockPlaces } from '../data/mockData';

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  Restaurant: { bg: '#FFF3E0', text: '#E65100', icon: '🍽️' },
  Attraction: { bg: '#E3F2FD', text: '#1565C0', icon: '🏛️' },
  Nature: { bg: '#E8F5E9', text: '#2E7D32', icon: '🌿' },
  Hotel: { bg: '#F3E5F5', text: '#6A1B9A', icon: '🏨' },
  Shopping: { bg: '#FCE4EC', text: '#880E4F', icon: '🛍️' },
  Other: { bg: '#ECEFF1', text: '#455A64', icon: '📍' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Published: { bg: '#E8F5E9', text: '#2E7D32' },
  Draft: { bg: '#F5F5F5', text: '#616161' },
  'Pending Review': { bg: '#FFF8E1', text: '#F57F17' },
  Archived: { bg: '#ECEFF1', text: '#546E7A' },
};

function CategoryChip({ category }: { category: string }) {
  const c = categoryColors[category] || categoryColors.Other;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 12,
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 500,
    }}>
      {c.icon} {category}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const s = statusColors[status] || { bg: '#F5F5F5', text: '#616161' };
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 12,
      background: s.bg, color: s.text, fontSize: 11, fontWeight: 500,
    }}>
      {status}
    </span>
  );
}

function PlaceActionMenu({ onEdit, onDelete, onView }: { onEdit: () => void; onDelete: () => void; onView: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(!open); }}
        style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A99' }}
        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 34, width: 160, background: '#fff', borderRadius: 8, border: '1px solid #E8ECF0', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
          <button onClick={() => { onView(); setOpen(false); }} style={menuStyle}><Eye size={13} color="#2196F3" /> View</button>
          <button onClick={() => { onEdit(); setOpen(false); }} style={menuStyle}><Edit size={13} color="#6B7A99" /> Edit</button>
          <div style={{ height: 1, background: '#E8ECF0' }} />
          <button onClick={() => { onDelete(); setOpen(false); }} style={{ ...menuStyle, color: '#F44336' }}><Trash2 size={13} color="#F44336" /> Delete</button>
        </div>
      )}
    </div>
  );
}

const menuStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', background: 'none', border: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
  fontSize: 12, color: '#1A2332', fontFamily: 'Poppins, sans-serif',
};

export default function PlaceList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });
  const [places, setPlaces] = useState(mockPlaces);

  const filtered = places.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const confirmDelete = () => {
    setPlaces(prev => prev.filter(p => p.id !== deleteModal.id));
    setDeleteModal({ open: false, id: '', name: '' });
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Place Management</h1>
          <p style={{ fontSize: 14, color: '#6B7A99' }}>Manage all destinations and travel locations</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid #E8ECF0', borderRadius: 8, overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                width: 36, height: 36, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: viewMode === 'table' ? '#2196F3' : '#fff', color: viewMode === 'table' ? '#fff' : '#6B7A99',
                transition: 'all 150ms',
              }}
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                width: 36, height: 36, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: viewMode === 'grid' ? '#2196F3' : '#fff', color: viewMode === 'grid' ? '#fff' : '#6B7A99',
                transition: 'all 150ms',
              }}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          <button
            onClick={() => navigate('/places/add')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
            }}
          >
            <Plus size={16} /> Add New Place
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', background: '#fff', height: 40, width: 300 }}>
          <Search size={14} color="#6B7A99" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city, category..."
            style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, fontFamily: 'Poppins, sans-serif', background: 'transparent' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={13} color="#6B7A99" /></button>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Category', val: catFilter, set: setCatFilter, opts: ['All', 'Restaurant', 'Hotel', 'Attraction', 'Nature', 'Shopping'] },
            { label: 'Status', val: statusFilter, set: setStatusFilter, opts: ['All', 'Published', 'Draft', 'Pending Review', 'Archived'] },
          ].map(sel => (
            <select key={sel.label} value={sel.val} onChange={e => sel.set(e.target.value)}
              style={{ height: 40, padding: '0 12px', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }}>
              {sel.opts.map(o => <option key={o} value={o}>{o === 'All' ? `All ${sel.label}` : o}</option>)}
            </select>
          ))}
          <button style={{ height: 40, padding: '0 14px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7A99' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['', 'PLACE NAME', 'CATEGORY', 'RATING', 'REVIEWS', 'STATUS', 'CREATED BY', 'ACTIONS'].map(col => (
                  <th key={col} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7A99', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(place => (
                <tr key={place.id}
                  style={{ borderBottom: '1px solid #E8ECF0', transition: 'background 150ms', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#F5F7FA'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fff'}
                >
                  <td style={{ padding: '14px 14px', width: 80 }}>
                    <img
                      src={place.thumbnail}
                      alt={place.name}
                      style={{ width: 60, height: 44, borderRadius: 8, objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=120&h=80&fit=crop'; }}
                    />
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', marginBottom: 2 }}>{place.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7A99', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={10} /> {place.location}
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px' }}><CategoryChip category={place.category} /></td>
                  <td style={{ padding: '14px 14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#1A2332' }}>
                      <Star size={13} fill="#FF9800" color="#FF9800" />
                      {place.rating}
                    </span>
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 13, color: '#6B7A99' }}>
                    {place.reviews.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 14px' }}><StatusChip status={place.status} /></td>
                  <td style={{ padding: '14px 14px', fontSize: 12, color: '#6B7A99', fontFamily: 'JetBrains Mono, monospace' }}>{place.createdBy}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <PlaceActionMenu
                      onView={() => {}}
                      onEdit={() => navigate(`/places/edit/${place.id}`)}
                      onDelete={() => setDeleteModal({ open: true, id: place.id, name: place.name })}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>No places found</div>
                    <div style={{ fontSize: 13, color: '#6B7A99' }}>Try adjusting your search or filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '14px 20px', borderTop: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7A99' }}>Showing {filtered.length} of {places.length} places</span>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filtered.map(place => (
            <div
              key={place.id}
              style={{
                background: '#fff', borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'box-shadow 200ms, transform 200ms',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 15px rgba(0,0,0,0.12)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ position: 'relative', height: 160 }}>
                <img
                  src={place.thumbnail}
                  alt={place.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=200&fit=crop'; }}
                />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <CategoryChip category={place.category} />
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <StatusChip status={place.status} />
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 5 }}>{place.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <MapPin size={11} color="#6B7A99" />
                  <span style={{ fontSize: 11, color: '#6B7A99' }}>{place.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={13} fill="#FF9800" color="#FF9800" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{place.rating}</span>
                    <span style={{ fontSize: 11, color: '#6B7A99' }}>({place.reviews.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => navigate(`/places/edit/${place.id}`)}
                      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E8ECF0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A99' }}>
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, id: place.id, name: place.name })}
                      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #FFCDD2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F44336' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', background: '#fff', borderRadius: 12 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>No places found</div>
              <div style={{ fontSize: 13, color: '#6B7A99' }}>Try adjusting your search or filters.</div>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setDeleteModal({ open: false, id: '', name: '' })}>
          <div style={{ background: '#fff', borderRadius: 16, width: 440, padding: 28, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>Delete Place</h3>
            <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 16 }}>
              Are you sure you want to permanently delete <strong>"{deleteModal.name}"</strong>?
            </p>
            <div style={{ padding: 14, background: '#FFF5F5', border: '1px solid #FFCDD2', borderRadius: 8, marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#C62828' }}>⚠️ This will permanently remove all data including all reviews associated with this place.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteModal({ open: false, id: '', name: '' })} style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6B7A99', fontFamily: 'Poppins, sans-serif' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={{ padding: '10px 20px', background: '#F44336', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
