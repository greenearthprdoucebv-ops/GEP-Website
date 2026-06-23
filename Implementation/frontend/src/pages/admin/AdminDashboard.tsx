import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadStorageFile } from '../../lib/storage'
import { productImageUrl, resolveAssetUrl } from '../../lib/productImage'
import gepLogo from '../../assets/about/GEPLogo.png'
import './Admin.css'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'hero' | 'home-products' | 'catalogue' | 'slideshow' | 'certifications' | 'about'

type HomeHero = { id: number; video_url: string; lead_text: string | null; mode: 'video' | 'slideshow' | null }

type HeroSlide = {
  id: number
  image_url: string
  title: string | null
  caption: string | null
  is_active: boolean
  sort_order: number
}

type Certification = {
  id: number
  name: string
  image_url: string | null
  is_active: boolean
  sort_order: number
}

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
      mode: modal.row.mode ?? 'video',
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
              <th>ID</th><th>Mode</th><th>Video URL</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td><span className={`admin-badge admin-badge--${row.mode === 'slideshow' ? 'active' : 'current'}`}>{row.mode ?? 'video'}</span></td>
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
            <span>Hero Mode</span>
            <select
              value={modal.row.mode ?? 'video'}
              onChange={e => setModal(m => m ? { ...m, row: { ...m.row, mode: e.target.value as 'video' | 'slideshow' } } : m)}
            >
              <option value="video">Video</option>
              <option value="slideshow">Image Slideshow</option>
            </select>
          </label>
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

// ── Hero Slideshow Section ────────────────────────────────────────────────────

function SlideshowSection() {
  const [rows, setRows]         = useState<HeroSlide[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; row: Partial<HeroSlide> } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [err, setErr]           = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase!.from('home_slideshow').select('*').order('sort_order')
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function blank(): Partial<HeroSlide> {
    return { image_url: '', title: 'THE GINGER EXPERTS', caption: '', is_active: true, sort_order: (rows.length || 0) + 1 }
  }

  function setField<K extends keyof HeroSlide>(key: K, val: HeroSlide[K]) {
    setModal(m => m ? { ...m, row: { ...m.row, [key]: val } } : m)
  }

  async function uploadImage(file: File) {
    setErr('')
    setUploadingImage(true)
    const { error, path } = await uploadStorageFile(file)
    setUploadingImage(false)
    if (error) { setErr(error.message); return null }
    return path
  }

  async function save() {
    if (!modal) return
    setSaving(true); setErr('')
    const payload = {
      image_url:  modal.row.image_url ?? '',
      title:      modal.row.title || null,
      caption:    modal.row.caption || null,
      is_active:  modal.row.is_active ?? true,
      sort_order: modal.row.sort_order ?? 0,
    }
    const { error } = modal.mode === 'edit' && modal.row.id
      ? await supabase!.from('home_slideshow').update(payload).eq('id', modal.row.id)
      : await supabase!.from('home_slideshow').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setModal(null); load()
  }

  async function toggleActive(row: HeroSlide) {
    await supabase!.from('home_slideshow').update({ is_active: !row.is_active }).eq('id', row.id)
    load()
  }

  async function del() {
    if (deleteId == null) return
    await supabase!.from('home_slideshow').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Hero Image Slideshow</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal({ mode: 'add', row: blank() })}>
          + Add Slide
        </button>
      </div>
      <p className="admin-section-hint">
        Manage slides shown in the hero when mode is set to <strong>Image Slideshow</strong> in the Home Hero tab.
        Active slides are shown in sort order, cycling every 5 seconds.
      </p>

      {loading ? <p className="admin-empty">Loading…</p> : rows.length === 0 ? (
        <p className="admin-empty">No slides yet. Add one above.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>Order</th><th>Preview</th><th>Title</th><th>Caption</th><th>Active</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.sort_order}</td>
                  <td>
                    {row.image_url && (
                      <img
                        src={productImageUrl(row.image_url)}
                        alt=""
                        style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                  </td>
                  <td>{row.title ?? '—'}</td>
                  <td className="admin-table__ellipsis">{row.caption ?? '—'}</td>
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
          title={modal.mode === 'add' ? 'Add Slide' : 'Edit Slide'}
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
            <span>Title (large heading on slide)</span>
            <input type="text" value={modal.row.title ?? ''} onChange={e => setField('title', e.target.value)} placeholder="THE GINGER EXPERTS" autoFocus />
          </label>
          <label className="admin-field">
            <span>Caption (subtitle text)</span>
            <input type="text" value={modal.row.caption ?? ''} onChange={e => setField('caption', e.target.value)} placeholder="Ginger Solutions for European Markets" />
          </label>
          <label className="admin-field">
            <span>Image URL</span>
            <input type="url" value={modal.row.image_url ?? ''} onChange={e => setField('image_url', e.target.value)} placeholder="https://…/slide.jpg" />
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
            {uploadingImage && <p>Uploading image…</p>}
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
            <span>Sort Order</span>
            <input type="number" min={0} value={modal.row.sort_order ?? 0} onChange={e => setField('sort_order', parseInt(e.target.value) || 0)} />
          </label>
          <label className="admin-checkbox-row">
            <input type="checkbox" checked={modal.row.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} />
            Active (visible in slideshow)
          </label>
        </Modal>
      )}

      {deleteId != null && (
        <ConfirmDialog
          message="This will permanently delete this slide."
          onConfirm={del}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Certifications Section ────────────────────────────────────────────────────

function CertificationsSection() {
  const [rows, setRows]         = useState<Certification[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<{ mode: 'add' | 'edit'; row: Partial<Certification> } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [err, setErr]           = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase!.from('certifications').select('*').order('sort_order')
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function blank(): Partial<Certification> {
    return { name: '', image_url: '', is_active: true, sort_order: (rows.length || 0) + 1 }
  }

  function setField<K extends keyof Certification>(key: K, val: Certification[K]) {
    setModal(m => m ? { ...m, row: { ...m.row, [key]: val } } : m)
  }

  async function uploadImage(file: File) {
    setErr('')
    setUploadingImage(true)
    const { error, path } = await uploadStorageFile(file)
    setUploadingImage(false)
    if (error) { setErr(error.message); return null }
    return path
  }

  async function save() {
    if (!modal) return
    setSaving(true); setErr('')
    const payload = {
      name:       modal.row.name ?? '',
      image_url:  modal.row.image_url || null,
      is_active:  modal.row.is_active ?? true,
      sort_order: modal.row.sort_order ?? 0,
    }
    const { error } = modal.mode === 'edit' && modal.row.id
      ? await supabase!.from('certifications').update(payload).eq('id', modal.row.id)
      : await supabase!.from('certifications').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setModal(null); load()
  }

  async function toggleActive(row: Certification) {
    await supabase!.from('certifications').update({ is_active: !row.is_active }).eq('id', row.id)
    load()
  }

  async function del() {
    if (deleteId == null) return
    await supabase!.from('certifications').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Certifications & Standards</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal({ mode: 'add', row: blank() })}>
          + Add Certification
        </button>
      </div>
      <p className="admin-section-hint">
        Manage certifications shown on the homepage. Upload a logo image for each. Active certifications appear in sort order.
      </p>

      {loading ? <p className="admin-empty">Loading…</p> : rows.length === 0 ? (
        <p className="admin-empty">No certifications yet. Add one above.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th>Order</th><th>Logo</th><th>Name</th><th>Active</th><th></th>
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.sort_order}</td>
                  <td>
                    {row.image_url ? (
                      <img
                        src={productImageUrl(row.image_url)}
                        alt=""
                        style={{ width: 60, height: 40, objectFit: 'contain', borderRadius: 4, background: '#f5f5f5', padding: 4 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : <span style={{ color: '#888', fontSize: '0.8rem' }}>No image</span>}
                  </td>
                  <td>{row.name}</td>
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
          title={modal.mode === 'add' ? 'Add Certification' : 'Edit Certification'}
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
            <input type="text" value={modal.row.name ?? ''} onChange={e => setField('name', e.target.value)} placeholder="IFS Food" autoFocus />
          </label>
          <label className="admin-field">
            <span>Logo Image URL</span>
            <input type="url" value={modal.row.image_url ?? ''} onChange={e => setField('image_url', e.target.value)} placeholder="https://…/logo.png" />
          </label>
          <label className="admin-field">
            <span>Upload Logo</span>
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
            {uploadingImage && <p>Uploading image…</p>}
          </label>
          {modal.row.image_url && (
            <div className="admin-img-preview" style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={productImageUrl(modal.row.image_url)}
                alt="Preview"
                style={{ maxHeight: 100, objectFit: 'contain' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}
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
          message="This will permanently delete this certification."
          onConfirm={del}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

// ── About Page Section ────────────────────────────────────────────────────────

type AboutContent = Record<string, string>

type AboutGroup = {
  label: string
  fields: { key: string; label: string; type: 'title' | 'body' | 'paragraph' }[]
}

const ABOUT_GROUPS: AboutGroup[] = [
  {
    label: 'Hero',
    fields: [
      { key: 'hero_title',  label: 'Title',       type: 'title' },
      { key: 'hero_para1',  label: 'Paragraph 1', type: 'paragraph' },
      { key: 'hero_para2',  label: 'Paragraph 2', type: 'paragraph' },
      { key: 'hero_para3',  label: 'Paragraph 3', type: 'paragraph' },
    ],
  },
  {
    label: 'Core Values',
    fields: [
      { key: 'values_subtitle', label: 'Subtitle',    type: 'body' },
      { key: 'value1_title',    label: 'Value 1 Title', type: 'title' },
      { key: 'value1_body',     label: 'Value 1 Body',  type: 'body' },
      { key: 'value2_title',    label: 'Value 2 Title', type: 'title' },
      { key: 'value2_body',     label: 'Value 2 Body',  type: 'body' },
      { key: 'value3_title',    label: 'Value 3 Title', type: 'title' },
      { key: 'value3_body',     label: 'Value 3 Body',  type: 'body' },
      { key: 'value4_title',    label: 'Value 4 Title', type: 'title' },
      { key: 'value4_body',     label: 'Value 4 Body',  type: 'body' },
    ],
  },
  {
    label: 'From Source to Market',
    fields: [
      { key: 'story_title',  label: 'Title',       type: 'title' },
      { key: 'story_para1',  label: 'Paragraph 1', type: 'paragraph' },
      { key: 'story_para2',  label: 'Paragraph 2', type: 'paragraph' },
      { key: 'story_para3',  label: 'Paragraph 3', type: 'paragraph' },
    ],
  },
  {
    label: 'What We Focus On',
    fields: [
      { key: 'focus_subtitle', label: 'Subtitle',    type: 'body' },
      { key: 'focus1_title',   label: 'Focus 1 Title', type: 'title' },
      { key: 'focus1_body',    label: 'Focus 1 Body',  type: 'body' },
      { key: 'focus2_title',   label: 'Focus 2 Title', type: 'title' },
      { key: 'focus2_body',    label: 'Focus 2 Body',  type: 'body' },
      { key: 'focus3_title',   label: 'Focus 3 Title', type: 'title' },
      { key: 'focus3_body',    label: 'Focus 3 Body',  type: 'body' },
      { key: 'focus4_title',   label: 'Focus 4 Title', type: 'title' },
      { key: 'focus4_body',    label: 'Focus 4 Body',  type: 'body' },
    ],
  },
  {
    label: 'A Responsible Approach',
    fields: [
      { key: 'approach_title',  label: 'Title',     type: 'title' },
      { key: 'approach_para',   label: 'Paragraph', type: 'paragraph' },
      { key: 'approach_check1', label: 'Check Item 1', type: 'body' },
      { key: 'approach_check2', label: 'Check Item 2', type: 'body' },
      { key: 'approach_check3', label: 'Check Item 3', type: 'body' },
      { key: 'approach_check4', label: 'Check Item 4', type: 'body' },
    ],
  },
  {
    label: 'Our Team',
    fields: [
      { key: 'team_title',  label: 'Title',       type: 'title' },
      { key: 'team_para1',  label: 'Paragraph 1', type: 'paragraph' },
      { key: 'team_para2',  label: 'Paragraph 2', type: 'paragraph' },
      { key: 'team_para3',  label: 'Paragraph 3', type: 'paragraph' },
    ],
  },
]

const ALL_ABOUT_KEYS = ABOUT_GROUPS.flatMap(g => g.fields.map(f => f.key))

const ABOUT_IMAGES: { key: string; label: string; hint: string }[] = [
  { key: 'hero_image_url',     label: 'Hero Image (right side)',         hint: 'Shown beside the intro text' },
  { key: 'story_image_url',    label: 'Story Image (left side)',         hint: '"From Source to Market" section' },
  { key: 'approach_image_url', label: 'Approach Image (right side)',     hint: '"A Responsible Approach" section' },
  { key: 'team_banner_url',    label: 'Team Banner (full width top)',    hint: '"Our Team" section banner' },
]

function AboutSection() {
  const [form, setForm]           = useState<AboutContent>({})
  const [rowId, setRowId]         = useState<number | null>(null)
  const [activeGroup, setActiveGroup] = useState(0)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [msg, setMsg]             = useState('')

  useEffect(() => {
    supabase!.from('about_content').select('*').limit(1).single().then(({ data }) => {
      if (data) { setForm(data); setRowId(data.id) }
      setLoading(false)
    })
  }, [])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function uploadImg(key: string, file: File) {
    setUploading(key); setMsg('')
    const { error, path } = await uploadStorageFile(file)
    setUploading(null)
    if (error) { setMsg(`Upload error: ${error.message}`); return }
    set(key, path ?? '')
  }

  async function save() {
    setSaving(true); setMsg('')
    const payload: AboutContent = {}
    ALL_ABOUT_KEYS.forEach(k => { payload[k] = form[k] ?? '' })
    ABOUT_IMAGES.forEach(img => { payload[img.key] = form[img.key] ?? '' })

    const { error } = rowId
      ? await supabase!.from('about_content').update(payload).eq('id', rowId)
      : await supabase!.from('about_content').insert(payload).select().single().then(r => {
          if (r.data) setRowId(r.data.id)
          return r
        })

    setSaving(false)
    setMsg(error ? `Error: ${error.message}` : 'Saved successfully.')
  }

  if (loading) return <p className="admin-empty">Loading…</p>

  const group = ABOUT_GROUPS[activeGroup]
  const isImages = activeGroup === ABOUT_GROUPS.length

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">About Page Content</h2>
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save All'}
        </button>
      </div>
      {msg && <p style={{ color: msg.startsWith('Error') ? '#b91c1c' : '#2ecc8a', marginBottom: 16 }}>{msg}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Scrollable section list */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', maxHeight: 520, overflowY: 'auto' }}>
          {ABOUT_GROUPS.map((g, i) => (
            <button key={g.label} onClick={() => setActiveGroup(i)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
              border: 'none', borderBottom: '1px solid #e5e7eb',
              background: i === activeGroup ? '#2ecc8a' : '#fff',
              color: i === activeGroup ? '#fff' : '#374151',
              fontWeight: i === activeGroup ? 600 : 400, fontSize: '0.9rem', cursor: 'pointer',
            }}>
              {g.label}
            </button>
          ))}
          {/* Images tab */}
          <button onClick={() => setActiveGroup(ABOUT_GROUPS.length)} style={{
            display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
            border: 'none', borderBottom: 'none',
            background: isImages ? '#2ecc8a' : '#fff',
            color: isImages ? '#fff' : '#374151',
            fontWeight: isImages ? 600 : 400, fontSize: '0.9rem', cursor: 'pointer',
          }}>
            🖼 Images
          </button>
        </div>

        {/* Right panel */}
        <div style={{ display: 'grid', gap: 20 }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isImages ? 'Section Images' : group.label}
          </p>

          {isImages ? (
            /* ── Image upload fields ── */
            ABOUT_IMAGES.map(img => (
              <div key={img.key} className="admin-field">
                <label className="admin-field__label">{img.label}</label>
                <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#6b7280' }}>{img.hint}</p>

                {/* Preview */}
                {form[img.key] ? (
                  <div style={{ marginBottom: 10, position: 'relative', width: 200, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <img
                      src={resolveAssetUrl(form[img.key])}
                      alt={img.label}
                      style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                    <button
                      onClick={() => set(img.key, '')}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '0.75rem' }}
                    >✕</button>
                  </div>
                ) : (
                  <div style={{ marginBottom: 10, width: 200, height: 120, borderRadius: 8, border: '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.8rem' }}>
                    No image
                  </div>
                )}

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadImg(img.key, f) }}
                  />
                  <span className="admin-btn admin-btn--ghost" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {uploading === img.key ? 'Uploading…' : 'Upload Image'}
                  </span>
                </label>
              </div>
            ))
          ) : (
            /* ── Text fields ── */
            group.fields.map(f => (
              <div key={f.key} className="admin-field">
                <label className="admin-field__label">
                  <span style={{
                    display: 'inline-block', marginRight: 8, padding: '1px 7px', borderRadius: 4,
                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                    background: f.type === 'title' ? '#dbeafe' : f.type === 'paragraph' ? '#d1fae5' : '#fef9c3',
                    color: f.type === 'title' ? '#1d4ed8' : f.type === 'paragraph' ? '#065f46' : '#92400e',
                  }}>
                    {f.type}
                  </span>
                  {f.label}
                </label>
                {f.type === 'title' || f.type === 'body' ? (
                  <input className="admin-field__input" type="text" value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                ) : (
                  <textarea className="admin-field__input" rows={3} value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'hero',             label: 'Home Hero'      },
  { key: 'slideshow',        label: 'Slideshow'      },
  { key: 'certifications',   label: 'Certifications' },
  { key: 'home-products',    label: 'Home Products'  },
  { key: 'catalogue',        label: 'Catalogue'      },
  { key: 'about',            label: 'About Page'     },
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
        <a href="/" className="admin-header__title" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={gepLogo} alt="GEP Logo" className="admin-header__logo" />
          Admin
        </a>
        <button
          className="admin-btn admin-btn--ghost"
          onClick={signOut}
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
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
        {tab === 'hero'           && <HeroSection />}
        {tab === 'slideshow'      && <SlideshowSection />}
        {tab === 'certifications' && <CertificationsSection />}
        {tab === 'home-products'  && <HomeProductsSection />}
        {tab === 'catalogue'      && <CatalogueSection />}
        {tab === 'about'          && <AboutSection />}
      </main>
    </div>
  )
}
