import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadStorageFile } from '../../lib/storage'
import { productImageUrl, resolveAssetUrl } from '../../lib/productImage'
import './Admin.css'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'hero' | 'home-products' | 'home-reviews' | 'catalogue'

type HomeHero = { id: number; video_url: string; lead_text: string | null }

type HomeProduct = {
  id: number
  name: string
  origin: string
  image_url: string | null
  description: string
  keywords: string[] | null
  image_left: boolean
  is_active: boolean
  sort_order: number
}

type HomeReview = {
  id: number
  stars: number
  review_text: string
  author: string
  role: string
  is_active: boolean
  sort_order: number
}

type CatalogueProduct = {
  id: string
  title: string
  weight: string | null
  description: string
  price: string | null
  tag: string | null
  origin: string | null
  availability: string | null
  cta: string | null
  image_url: string | null
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Modal({ title, onClose, children, footer }: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="admin-modal__header">
          <h2 id="modal-title" className="admin-modal__title">{title}</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
        <div className="admin-modal__footer">{footer}</div>
      </div>
    </div>
  )
}

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="admin-confirm-overlay">
      <div className="admin-confirm">
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className="admin-confirm__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection() {
  const [rows, setRows]       = useState<HomeHero[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<{ mode: 'add' | 'edit'; row: Partial<HomeHero> } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving]   = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [err, setErr]         = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase!.from('home_hero').select('*').order('id', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function uploadVideo(file: File) {
    setErr('')
    setUploadingVideo(true)
    const { error, path } = await uploadStorageFile(file)
    setUploadingVideo(false)
    if (error) {
      setErr(error.message)
      return null
    }
    return path
  }

  async function save() {
    if (!modal) return
    setSaving(true); setErr('')
    const payload = {
      video_url: modal.row.video_url?.trim() ?? '',
      lead_text: modal.row.lead_text?.trim() || null,
    }
    const { error } = modal.mode === 'edit' && modal.row.id
      ? await supabase!.from('home_hero').update(payload).eq('id', modal.row.id)
      : await supabase!.from('home_hero').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setModal(null); load()
  }

  async function del() {
    if (deleteId == null) return
    await supabase!.from('home_hero').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Home Hero Video</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal({ mode: 'add', row: { video_url: '', lead_text: '' } })}>
          + Add Video
        </button>
      </div>
      <p className="admin-section-hint">Edit the video URL and the overlay text shown on the homepage hero. The row marked <strong>Current</strong> (highest ID) is the live one.</p>

      {loading ? <p className="admin-empty">Loading…</p> : rows.length === 0 ? (
        <p className="admin-empty">No hero videos yet. Add one above.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>ID</th><th>Video URL</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td className="admin-table__ellipsis">{row.video_url}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${i === 0 ? 'current' : 'archived'}`}>
                      {i === 0 ? 'Current' : 'Archived'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setModal({ mode: 'edit', row })}>Edit</button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(row.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Hero Video' : 'Edit Hero Video'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="admin-btn admin-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>}
        >
          {err && <p className="admin-error">{err}</p>}
          <label className="admin-field">
            <span>Hero Text (shown on homepage over the video)</span>
            <textarea
              value={modal.row.lead_text ?? ''}
              onChange={e => setModal(m => m ? { ...m, row: { ...m.row, lead_text: e.target.value } } : m)}
              rows={2}
              placeholder="Premium ginger sourced directly from farms across Asia and South America."
              autoFocus
            />
          </label>
          <label className="admin-field">
            <span>Video URL or Upload</span>
            <input
              type="url"
              value={modal.row.video_url ?? ''}
              onChange={e => setModal(m => m ? { ...m, row: { ...m.row, video_url: e.target.value } } : m)}
              placeholder="https://…/hero.mp4"
            />
          </label>
          <label className="admin-field">
            <span>Upload Video</span>
            <input
              type="file"
              accept="video/mp4"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const path = await uploadVideo(file)
                if (path) setModal(m => m ? { ...m, row: { ...m.row, video_url: path } } : m)
              }}
            />
            {uploadingVideo ? <p>Uploading video…</p> : null}
          </label>
          {modal.row.video_url && (
            <div className="admin-video-preview">
              <video src={resolveAssetUrl(modal.row.video_url)} controls muted />
            </div>
          )}
        </Modal>
      )}

      {deleteId != null && (
        <ConfirmDialog
          message="This will permanently delete this hero video entry."
          onConfirm={del}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Home Products Section ─────────────────────────────────────────────────────

function HomeProductsSection() {
  const [rows, setRows]         = useState<HomeProduct[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; row: Partial<HomeProduct> } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [err, setErr]           = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase!.from('home_products').select('*').order('sort_order')
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function blank(): Partial<HomeProduct> {
    return { name: '', origin: '', image_url: '', description: '', keywords: [], image_left: true, is_active: true, sort_order: (rows.length || 0) + 1 }
  }

  function setField<K extends keyof HomeProduct>(key: K, val: HomeProduct[K]) {
    setModal(m => m ? { ...m, row: { ...m.row, [key]: val } } : m)
  }

  async function uploadImage(file: File) {
    setErr('')
    setUploadingImage(true)
    const { error, path } = await uploadStorageFile(file)
    setUploadingImage(false)
    if (error) {
      setErr(error.message)
      return null
    }
    return path
  }

  async function save() {
    if (!modal) return
    setSaving(true); setErr('')
    const payload = {
      name:        modal.row.name ?? '',
      origin:      modal.row.origin ?? '',
      image_url:   modal.row.image_url || null,
      description: modal.row.description ?? '',
      keywords:    modal.row.keywords ?? [],
      image_left:  modal.row.image_left ?? true,
      is_active:   modal.row.is_active ?? true,
      sort_order:  modal.row.sort_order ?? 0,
    }
    const { error } = modal.mode === 'edit' && modal.row.id
      ? await supabase!.from('home_products').update(payload).eq('id', modal.row.id)
      : await supabase!.from('home_products').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setModal(null); load()
  }

  async function toggleActive(row: HomeProduct) {
    await supabase!.from('home_products').update({ is_active: !row.is_active }).eq('id', row.id)
    load()
  }

  async function del() {
    if (deleteId == null) return
    await supabase!.from('home_products').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Home Page Products</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal({ mode: 'add', row: blank() })}>
          + Add Product
        </button>
      </div>
      <p className="admin-section-hint">Only active products are shown on the homepage, ordered by Sort Order.</p>

      {loading ? <p className="admin-empty">Loading…</p> : rows.length === 0 ? (
        <p className="admin-empty">No home products yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>Order</th><th>Name</th><th>Origin</th><th>Image Side</th><th>Active</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.sort_order}</td>
                  <td>{row.name}</td>
                  <td>{row.origin}</td>
                  <td>{row.image_left ? 'Left' : 'Right'}</td>
                  <td>
                    <span
                      className={`admin-badge admin-badge--${row.is_active ? 'active' : 'inactive'} admin-badge--clickable`}
                      onClick={() => toggleActive(row)}
                      title="Click to toggle"
                    >
                      {row.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setModal({ mode: 'edit', row })}>Edit</button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(row.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Home Product' : 'Edit Home Product'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="admin-btn admin-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>}
        >
          {err && <p className="admin-error">{err}</p>}
          <label className="admin-field">
            <span>Name</span>
            <input type="text" value={modal.row.name ?? ''} onChange={e => setField('name', e.target.value)} autoFocus />
          </label>
          <label className="admin-field">
            <span>Origin</span>
            <input type="text" value={modal.row.origin ?? ''} onChange={e => setField('origin', e.target.value)} placeholder="Shandong, China" />
          </label>
          <label className="admin-field">
            <span>Image URL or Upload</span>
            <input type="url" value={modal.row.image_url ?? ''} onChange={e => setField('image_url', e.target.value)} placeholder="https://…/image.jpg" />
          </label>
          <label className="admin-field">
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const path = await uploadImage(file)
                if (path) setField('image_url', path)
              }}
            />
            {uploadingImage ? <p>Uploading image…</p> : null}
          </label>
          {modal.row.image_url && (
            <div className="admin-img-preview">
              <img
                src={productImageUrl(modal.row.image_url)}
                alt="Preview"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
          <label className="admin-field">
            <span>Description</span>
            <textarea value={modal.row.description ?? ''} onChange={e => setField('description', e.target.value)} rows={3} />
          </label>
          <label className="admin-field">
            <span>Keywords (comma-separated)</span>
            <input
              type="text"
              value={(modal.row.keywords ?? []).join(', ')}
              onChange={e => setField('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
              placeholder="Organic, Grade A, Year-round supply"
            />
          </label>
          <label className="admin-field">
            <span>Sort Order</span>
            <input type="number" min={0} value={modal.row.sort_order ?? 0} onChange={e => setField('sort_order', parseInt(e.target.value) || 0)} />
          </label>
          <label className="admin-checkbox-row">
            <input type="checkbox" checked={modal.row.image_left ?? true} onChange={e => setField('image_left', e.target.checked)} />
            Image on left side
          </label>
          <label className="admin-checkbox-row">
            <input type="checkbox" checked={modal.row.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} />
            Active (visible on homepage)
          </label>
        </Modal>
      )}

      {deleteId != null && (
        <ConfirmDialog
          message="This will permanently delete this home product."
          onConfirm={del}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Home Reviews Section ──────────────────────────────────────────────────────

function HomeReviewsSection() {
  const [rows, setRows]         = useState<HomeReview[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; row: Partial<HomeReview> } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase!.from('home_reviews').select('*').order('sort_order')
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function blank(): Partial<HomeReview> {
    return { stars: 5, review_text: '', author: '', role: '', is_active: true, sort_order: (rows.length || 0) + 1 }
  }

  function setField<K extends keyof HomeReview>(key: K, val: HomeReview[K]) {
    setModal(m => m ? { ...m, row: { ...m.row, [key]: val } } : m)
  }

  async function save() {
    if (!modal) return
    setSaving(true); setErr('')
    const payload = {
      stars:       modal.row.stars ?? 5,
      review_text: modal.row.review_text ?? '',
      author:      modal.row.author ?? '',
      role:        modal.row.role ?? '',
      is_active:   modal.row.is_active ?? true,
      sort_order:  modal.row.sort_order ?? 0,
    }
    const { error } = modal.mode === 'edit' && modal.row.id
      ? await supabase!.from('home_reviews').update(payload).eq('id', modal.row.id)
      : await supabase!.from('home_reviews').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setModal(null); load()
  }

  async function toggleActive(row: HomeReview) {
    await supabase!.from('home_reviews').update({ is_active: !row.is_active }).eq('id', row.id)
    load()
  }

  async function del() {
    if (deleteId == null) return
    await supabase!.from('home_reviews').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Home Page Reviews</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal({ mode: 'add', row: blank() })}>
          + Add Review
        </button>
      </div>
      <p className="admin-section-hint">Only active reviews appear in the homepage carousel, ordered by Sort Order.</p>

      {loading ? <p className="admin-empty">Loading…</p> : rows.length === 0 ? (
        <p className="admin-empty">No reviews yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>Order</th><th>Stars</th><th>Author</th><th>Role</th><th>Review</th><th>Active</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.sort_order}</td>
                  <td><span className="admin-stars">{'★'.repeat(row.stars)}{'☆'.repeat(5 - row.stars)}</span></td>
                  <td>{row.author}</td>
                  <td className="admin-table__ellipsis">{row.role}</td>
                  <td className="admin-table__ellipsis">{row.review_text}</td>
                  <td>
                    <span
                      className={`admin-badge admin-badge--${row.is_active ? 'active' : 'inactive'} admin-badge--clickable`}
                      onClick={() => toggleActive(row)}
                      title="Click to toggle"
                    >
                      {row.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setModal({ mode: 'edit', row })}>Edit</button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(row.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Review' : 'Edit Review'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="admin-btn admin-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>}
        >
          {err && <p className="admin-error">{err}</p>}
          <label className="admin-field">
            <span>Stars (1–5)</span>
            <input
              type="number" min={1} max={5}
              value={modal.row.stars ?? 5}
              onChange={e => setField('stars', Math.min(5, Math.max(1, parseInt(e.target.value) || 5)))}
              autoFocus
            />
          </label>
          <label className="admin-field">
            <span>Author</span>
            <input type="text" value={modal.row.author ?? ''} onChange={e => setField('author', e.target.value)} placeholder="Maria L." />
          </label>
          <label className="admin-field">
            <span>Role / Company</span>
            <input type="text" value={modal.row.role ?? ''} onChange={e => setField('role', e.target.value)} placeholder="Head of Procurement, FoodCo" />
          </label>
          <label className="admin-field">
            <span>Review Text</span>
            <textarea value={modal.row.review_text ?? ''} onChange={e => setField('review_text', e.target.value)} rows={4} />
          </label>
          <label className="admin-field">
            <span>Sort Order</span>
            <input type="number" min={0} value={modal.row.sort_order ?? 0} onChange={e => setField('sort_order', parseInt(e.target.value) || 0)} />
          </label>
          <label className="admin-checkbox-row">
            <input type="checkbox" checked={modal.row.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} />
            Active (visible on homepage)
          </label>
        </Modal>
      )}

      {deleteId != null && (
        <ConfirmDialog
          message="This will permanently delete this review."
          onConfirm={del}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Catalogue Section ─────────────────────────────────────────────────────────

function CatalogueSection() {
  const [rows, setRows]         = useState<CatalogueProduct[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; row: Partial<CatalogueProduct> } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [err, setErr]           = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase!.from('products').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function blank(): Partial<CatalogueProduct> {
    return { title: '', weight: '', description: '', price: '', tag: '', origin: '', availability: 'Available', cta: 'contact', image_url: '' }
  }

  function setField<K extends keyof CatalogueProduct>(key: K, val: CatalogueProduct[K]) {
    setModal(m => m ? { ...m, row: { ...m.row, [key]: val } } : m)
  }

  async function uploadImage(file: File) {
    setErr('')
    setUploadingImage(true)
    const { error, path } = await uploadStorageFile(file)
    setUploadingImage(false)
    if (error) {
      setErr(error.message)
      return null
    }
    return path
  }

  async function save() {
    if (!modal) return
    setSaving(true); setErr('')
    const payload = {
      title:            modal.row.title ?? '',
      name:             modal.row.title ?? '',   // mirrors title for legacy column
      weight:           modal.row.weight || null,
      description:      modal.row.description ?? '',
      price:            modal.row.price || null,
      tag:              modal.row.tag || null,
      origin:           modal.row.origin || null,
      availability:     modal.row.availability || null,
      cta:          modal.row.cta || null,
      image_url:    modal.row.image_url || null,
    }
    const { error } = modal.mode === 'edit' && modal.row.id
      ? await supabase!.from('products').update(payload).eq('id', modal.row.id)
      : await supabase!.from('products').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setModal(null); load()
  }

  async function del() {
    if (deleteId == null) return
    await supabase!.from('products').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Catalogue Products</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal({ mode: 'add', row: blank() })}>
          + Add Product
        </button>
      </div>

      {loading ? <p className="admin-empty">Loading…</p> : rows.length === 0 ? (
        <p className="admin-empty">No catalogue products yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>Title</th><th>Origin</th><th>Price</th><th>Availability</th><th>Tag</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.title}</td>
                  <td>{row.origin ?? '—'}</td>
                  <td>{row.price ? `€${row.price}` : '—'}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${row.availability === 'Available' ? 'active' : 'inactive'}`}>
                      {row.availability ?? '—'}
                    </span>
                  </td>
                  <td>{row.tag ?? '—'}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setModal({ mode: 'edit', row })}>Edit</button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(row.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Catalogue Product' : 'Edit Catalogue Product'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="admin-btn admin-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>}
        >
          {err && <p className="admin-error">{err}</p>}
          <label className="admin-field">
            <span>Title</span>
            <input type="text" value={modal.row.title ?? ''} onChange={e => setField('title', e.target.value)} autoFocus />
          </label>
          <label className="admin-field">
            <span>Origin</span>
            <input type="text" value={modal.row.origin ?? ''} onChange={e => setField('origin', e.target.value)} placeholder="Shandong, China" />
          </label>
          <label className="admin-field">
            <span>Weight</span>
            <input type="text" value={modal.row.weight ?? ''} onChange={e => setField('weight', e.target.value)} placeholder="250g" />
          </label>
          <label className="admin-field">
            <span>Description</span>
            <textarea value={modal.row.description ?? ''} onChange={e => setField('description', e.target.value)} rows={3} />
          </label>
          <label className="admin-field">
            <span>Price (€)</span>
            <input type="text" value={modal.row.price ?? ''} onChange={e => setField('price', e.target.value)} placeholder="12.50" />
          </label>
          <label className="admin-field">
            <span>Tag</span>
            <input type="text" value={modal.row.tag ?? ''} onChange={e => setField('tag', e.target.value)} placeholder="Organic, Best Seller…" />
          </label>
          <label className="admin-field">
            <span>Availability</span>
            <select value={modal.row.availability ?? 'Available'} onChange={e => setField('availability', e.target.value)}>
              <option>Available</option>
              <option>Out of Stock</option>
              <option>Seasonal</option>
              <option>Pre-order</option>
            </select>
          </label>
          <label className="admin-field">
            <span>CTA</span>
            <select value={modal.row.cta ?? 'contact'} onChange={e => setField('cta', e.target.value)}>
              <option value="contact">Contact for Order</option>
              <option value="cart">Add to Cart</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Image URL or Upload</span>
            <input type="url" value={modal.row.image_url ?? ''} onChange={e => setField('image_url', e.target.value)} placeholder="https://…/image.jpg" />
          </label>
          <label className="admin-field">
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const path = await uploadImage(file)
                if (path) setField('image_url', path)
              }}
            />
            {uploadingImage ? <p>Uploading image…</p> : null}
          </label>
          {modal.row.image_url && (
            <div className="admin-img-preview">
              <img
                src={productImageUrl(modal.row.image_url)}
                alt="Preview"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
        </Modal>
      )}

      {deleteId != null && (
        <ConfirmDialog
          message="This will permanently delete this catalogue product."
          onConfirm={del}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string }[] = [
  { key: 'hero',          label: 'Home Hero'     },
  { key: 'home-products', label: 'Home Products' },
  { key: 'home-reviews',  label: 'Home Reviews'  },
  { key: 'catalogue',     label: 'Catalogue'     },
]

export function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState<Tab>('hero')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { navigate('/admin', { replace: true }); return }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin', { replace: true })
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin', { replace: true })
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/admin', { replace: true })
  }

  if (loading) return <div className="admin-loading">Checking session…</div>

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <span className="admin-header__title">GreenEarth Admin</span>
        <button
          className="admin-btn admin-btn--ghost"
          onClick={signOut}
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.28)' }}
        >
          Sign Out
        </button>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`admin-tab-btn${tab === t.key ? ' admin-tab-btn--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        {tab === 'hero'          && <HeroSection />}
        {tab === 'home-products' && <HomeProductsSection />}
        {tab === 'home-reviews'  && <HomeReviewsSection />}
        {tab === 'catalogue'     && <CatalogueSection />}
      </main>
    </div>
  )
}
