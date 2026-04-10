import { useEffect, useState } from 'react'
import { getContent } from '../lib/api'
import './InnerPage.css'

export default function Publications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    getContent('publications')
      .then(({ items }) => setItems(items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const types = Array.from(new Set(items
    .map(item => (item.type || '').trim())
    .filter(Boolean)
  )).sort()

  const filteredItems = filterType === 'All'
    ? items
    : items.filter(item => (item.type || '').trim() === filterType)

  return (
    <div className="inner-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="page-wrap">
        <header className="inner-page__header">
          <p className="inner-page__eyebrow">Kataru Yahya</p>
          <h1 className="inner-page__title">Other publications</h1>
          <p className="inner-page__desc">Poems, essays, and short prose — published in journals, anthologies, and online platforms.</p>
          <div className="content-filters" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button className={`btn btn-ghost${filterType === 'All' ? ' active' : ''}`} onClick={() => setFilterType('All')}>All</button>
            {types.map(type => (
              <button
                key={type}
                className={`btn btn-ghost${filterType === type ? ' active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </header>

        {loading && <p className="loading-line">Loading—</p>}
        {!loading && filteredItems.length === 0 && <p className="empty-state">No publications listed yet.</p>}

        {!loading && filteredItems.length > 0 && (
          <div className="content-list">
            {filteredItems.map(item => (
              <article key={item._id} className="content-item">
                <div className="content-item__main">
                  {item.type && <p className="content-item__label">{item.type}</p>}
                  <h2 className="content-item__title">{item.title}</h2>
                  {item.venue && <p className="content-item__venue">{item.venue}</p>}
                  {item.description && <p className="content-item__desc">{item.description}</p>}
                </div>
                <div className="content-item__side">
                  {item.date && <span className="content-item__date">{item.date}</span>}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="content-item__link">
                      Read ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
