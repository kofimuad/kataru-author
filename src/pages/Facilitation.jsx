import { useEffect, useState } from 'react'
import { getContent } from '../lib/api'
import './InnerPage.css'

export default function Facilitation() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent('workshops')
      .then(({ items }) => setItems(items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="inner-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="page-wrap">
        <header className="inner-page__header">
          <p className="inner-page__eyebrow">Kataru Yahya</p>
          <h1 className="inner-page__title">Facilitation &amp; Workshops</h1>
          <p className="inner-page__desc">
            Writing workshops, creative literacy programmes, commissions, and other work facilitated for communities and institutions.
          </p>
        </header>

        {loading && <p className="loading-line">Loading—</p>}
        {!loading && items.length === 0 && <p className="empty-state">No workshops listed yet.</p>}

        {!loading && items.length > 0 && (
          <div className="content-list">
            {items.map(item => (
              <article key={item._id} className="content-item">
                <div className="content-item__main">
                  {item.category && <p className="content-item__label">{item.category}</p>}
                  <h2 className="content-item__title">{item.title}</h2>
                  {item.organisation && <p className="content-item__venue">{item.organisation}</p>}
                  {item.description && <p className="content-item__desc">{item.description}</p>}
                </div>
                <div className="content-item__side">
                  {item.date && <span className="content-item__date">{item.date}</span>}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="content-item__link">
                      Info ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Enquiry CTA */}
        <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ marginBottom: '0.35rem' }}>Commission or invite Kataru</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ink-muted)' }}>
              Available for workshops, residencies, readings, and commissioned writing.
            </p>
          </div>
          <a href="/contact" className="btn btn-outline">Get in touch</a>
        </div>
      </div>
    </div>
  )
}
