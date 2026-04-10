import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, saveContent, deleteContent, uploadImage } from '../../lib/api'
import './Admin.css'

const SECTIONS = [
  { id: 'bio', label: 'Bio' },
  { id: 'books', label: 'Books' },
  { id: 'publications', label: 'Publications' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'workshops', label: 'Others' },
]

const FIELDS = {
  books: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'publisher', label: 'Publisher', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'buyLink', label: 'Buy link', type: 'url' },
    { key: 'goodreadsLink', label: 'Goodreads', type: 'url' },
    { key: 'publisherLink', label: 'Publisher link', type: 'url' },
    { key: 'coverImage', label: 'Cover image', type: 'image' },
  ],
  publications: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'type', label: 'Type (Poem / Essay / Story…)', type: 'text' },
    { key: 'venue', label: 'Publication / venue', type: 'text' },
    { key: 'date', label: 'Date (e.g. March 2024)', type: 'text' },
    { key: 'description', label: 'Note / excerpt', type: 'textarea' },
    { key: 'link', label: 'Link', type: 'url' },
  ],
  interviews: [
    { key: 'title', label: 'Title / headline', type: 'text', required: true },
    { key: 'format', label: 'Format (Interview / Profile / Podcast…)', type: 'text' },
    { key: 'outlet', label: 'Outlet / platform', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'link', label: 'Link', type: 'url' },
  ],
  workshops: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'category', label: 'Category (Workshop / Commission / Residency…)', type: 'text' },
    { key: 'organisation', label: 'Organisation / host', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'link', label: 'Link', type: 'url' },
  ],
}

function BioEditor() {
  const [data, setData] = useState({ photo: '', photoCaption: '', paragraphs: '', pressLine: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const load = async () => {
    setLoading(true)
    setMsg('')
    try {
      const { data: d } = await getContent('bio')
      setData(d || { photo: '', photoCaption: '', paragraphs: '', pressLine: '' })
    } catch (err) {
      setMsg('Could not load bio: ' + err.message)
      setData({ photo: '', photoCaption: '', paragraphs: '', pressLine: '' })
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const payload = { ...data }
      payload.paragraphs = Array.isArray(payload.paragraphs)
        ? payload.paragraphs
        : (payload.paragraphs || '').split('\n\n').filter(Boolean)
      await saveContent('bio', payload)
      setMsg('Saved.')
    } catch (e) { setMsg('Error: ' + e.message) }
    setSaving(false)
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const { imageUrl } = await uploadImage(ev.target.result, 'kataru-bio')
        setData(d => ({ ...d, photo: imageUrl }))
      } catch { setData(d => ({ ...d, photo: ev.target.result })) }
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  if (loading) return <p>Loading bio…</p>

  const paragraphsText = Array.isArray(data.paragraphs) ? data.paragraphs.join('\n\n') : (data.paragraphs || '')

  return (
    <div className="admin-bio-editor">
      {msg && <p className={"admin-msg" + (msg.startsWith('Error') ? " admin-msg--err" : "")}>{msg}</p>}
      <div className="field-group">
        <label className="field-label">Photo</label>
        {data.photo && <img src={data.photo} alt="" className="admin-bio-preview" />}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          <button className="btn btn-ghost" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : data.photo ? 'Replace photo' : 'Upload photo'}
          </button>
          {data.photo && <button className="btn btn-ghost" onClick={() => setData(d => ({ ...d, photo: '' }))}>Remove</button>}
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Photo caption</label>
        <input className="field-input" value={data.photoCaption || ''} onChange={e => setData(d => ({ ...d, photoCaption: e.target.value }))} placeholder="e.g. Photo by Name" />
      </div>
      <div className="field-group">
        <label className="field-label">Bio paragraphs <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(separate paragraphs with a blank line)</span></label>
        <textarea className="field-textarea" rows={12} value={paragraphsText} onChange={e => setData(d => ({ ...d, paragraphs: e.target.value }))} placeholder={"First paragraph…\n\nSecond paragraph…"} />
      </div>
      <div className="field-group">
        <label className="field-label">Press line (optional)</label>
        <input className="field-input" value={data.pressLine || ''} onChange={e => setData(d => ({ ...d, pressLine: e.target.value }))} placeholder="e.g. For press enquiries, contact…" />
      </div>
      <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save bio'}</button>
    </div>
  )
}

function ListEditor({ type }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({})
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()
  const fields = FIELDS[type] || []

  const load = async () => {
    setLoading(true)
    setMsg('')
    try {
      const { items: its } = await getContent(type)
      setItems(its || [])
    } catch (err) {
      setMsg('Could not load items: ' + err.message)
      setItems([])
    }
    setLoading(false)
  }

  const reset = () => { setForm({}); setEditId(null); setMsg('') }
  const edit = (item) => { setForm({ ...item }); setEditId(item._id); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      await saveContent(type, editId ? { _id: editId, ...form } : { ...form })
      setMsg(editId ? 'Updated.' : 'Added.'); reset(); load()
    } catch (e) { setMsg('Error: ' + e.message) }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return
    try { await deleteContent(type, id); load() } catch (e) { alert(e.message) }
  }

  const handleImage = (e) => {
    const file = e.target.files[0]; if (!file) return; setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try { const { imageUrl } = await uploadImage(ev.target.result, `kataru-${type}`); setForm(f => ({ ...f, coverImage: imageUrl })) }
      catch { setForm(f => ({ ...f, coverImage: ev.target.result })) }
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => { load() }, [type])

  if (loading) return <p>Loading {type}…</p>

  return (
    <div>
      <div className="admin-form-box">
        <h3 className="admin-form-box__title">{editId ? 'Edit item' : 'Add new'}</h3>
        {msg && <p className={"admin-msg" + (msg.startsWith('Error') ? " admin-msg--err" : "")}>{msg}</p>}
        {fields.map(f => (
          <div className="field-group" key={f.key}>
            <label className="field-label">{f.label}{f.required && ' *'}</label>
            {f.type === 'textarea' ? (
              <textarea className="field-textarea" rows={4} value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
            ) : f.type === 'image' ? (
              <div>
                {form.coverImage && <img src={form.coverImage} alt="" className="admin-cover-preview" />}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                <button className="btn btn-ghost" style={{ marginTop: '0.5rem' }} onClick={() => fileRef.current.click()} disabled={uploading}>
                  {uploading ? 'Uploading…' : form.coverImage ? 'Replace image' : 'Upload image'}
                </button>
              </div>
            ) : (
              <input type={f.type} className="field-input" value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editId ? 'Update' : 'Add'}</button>
          {editId && <button className="btn btn-ghost" onClick={reset}>Cancel</button>}
        </div>
      </div>
      <div className="admin-list">
        <h3 className="admin-list__title">{items.length} item{items.length !== 1 ? 's' : ''}</h3>
        {items.length === 0 && <p className="admin-list__empty">Nothing here yet.</p>}
        {items.map(item => (
          <div key={item._id} className="admin-list-item">
            {item.coverImage && <img src={item.coverImage} alt="" className="admin-list-item__img" />}
            <div className="admin-list-item__text">
              <p className="admin-list-item__title">{item.title}</p>
              <p className="admin-list-item__meta">{[item.venue, item.outlet, item.publisher, item.organisation, item.year, item.date].filter(Boolean).join(' · ')}</p>
            </div>
            <div className="admin-list-item__actions">
              <button className="btn btn-ghost" onClick={() => edit(item)}>Edit</button>
              <button className="btn btn-ghost admin-btn-del" onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [active, setActive] = useState('bio')
  const navigate = useNavigate()
  const logout = () => { sessionStorage.removeItem('ky_admin'); sessionStorage.removeItem('admin_pin'); navigate('/admin/login') }

  return (
    <div className="admin-dash" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="admin-dash__header">
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="admin-dash__eyebrow">Admin Dashboard</p>
            <h1 className="admin-dash__title">Kataru Yahya</h1>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Log out</button>
        </div>
      </div>
      <div className="page-wrap">
        <div className="admin-tabs">
          {SECTIONS.map(s => (
            <button key={s.id} className={"admin-tab" + (active === s.id ? " admin-tab--active" : "")} onClick={() => setActive(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="admin-panel">
          {active === 'bio' && <BioEditor />}
          {active !== 'bio' && <ListEditor key={active} type={active} />}
        </div>
      </div>
    </div>
  )
}
