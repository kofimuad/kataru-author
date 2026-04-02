import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getContent } from '../lib/api'
import './Bio.css'

const DEFAULT_BIO = {
  photo: '',
  paragraphs: [
    'Kataru Yahya is a Ghanaian writer and medical sonographer. She is the author of the novel Home Is a Silhouette.',
    'Her work can be found or is forthcoming in Ta Adesa, Eunoia Review, The Disappointed Housewife, Mouthful of Salt and elsewhere.',
    'You can find her on social media at @kforkataru.',
  ],
  pressLine: '',
}

export default function Bio() {
  const [bio, setBio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent('bio')
      .then(({ data }) => setBio(data || DEFAULT_BIO))
      .catch(() => setBio(DEFAULT_BIO))
      .finally(() => setLoading(false))
  }, [])

  const data = bio || DEFAULT_BIO
  const paragraphs = Array.isArray(data.paragraphs)
    ? data.paragraphs
    : (data.paragraphs || '').split('\n\n').filter(Boolean)

  return (
    <div className="bio-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="page-wrap">

        <section className="bio-hero">
          <div className="bio-photo-col">
            <div className="bio-photo-wrap">
              {data.photo ? (
                <img src={data.photo} alt="Kataru Yahya" className="bio-photo" />
              ) : (
                <div className="bio-photo-placeholder">
                  <span>Photo</span>
                </div>
              )}
              {data.photoCaption && (
                <p className="bio-photo-caption">{data.photoCaption}</p>
              )}
            </div>
          </div>

          <div className="bio-text-col">
            <p className="bio-eyebrow">Bio</p>
            <h1 className="bio-name">Kataru<br />Yahya</h1>
            <div className="bio-rule" />

            {loading ? (
              <p className="loading-line">—</p>
            ) : (
              paragraphs.map((p, i) => (
                <p key={i} className="bio-para">{p}</p>
              ))
            )}

            {data.pressLine && (
              <p className="bio-press">{data.pressLine}</p>
            )}

            <div className="bio-links">
              <a href="https://substack.com/@kataru" target="_blank" rel="noopener noreferrer" className="bio-link">Newsletter</a>
              <a href="https://www.instagram.com/kforkataru/" target="_blank" rel="noopener noreferrer" className="bio-link">Instagram</a>
              <a href="https://x.com/kforkataru" target="_blank" rel="noopener noreferrer" className="bio-link">Twitter</a>
              <Link to="/contact" className="bio-link">Contact</Link>
            </div>
          </div>
        </section>

        <section className="bio-nav-grid">
          {[
            { label: 'Books',        path: '/books',       desc: 'Published works' },
            { label: 'Publications', path: '/publications', desc: 'Essays, poems & more' },
            { label: 'Interviews',   path: '/interviews',  desc: 'Conversations' },
            { label: 'Facilitation', path: '/facilitation', desc: 'Workshops & commissions' },
          ].map(({ label, path, desc }) => (
            <Link key={path} to={path} className="bio-nav-card">
              <span className="bio-nav-card__label">{label}</span>
              <span className="bio-nav-card__desc">{desc}</span>
              <span className="bio-nav-card__arrow">→</span>
            </Link>
          ))}
        </section>

        <section className="bio-newsletter">
          <div className="bio-newsletter__text">
            <h2 className="bio-newsletter__heading">Subscribe to the newsletter</h2>
            <p className="bio-newsletter__sub">Essays, poems, and dispatches — delivered via Substack.</p>
          </div>
          <a href="https://substack.com/@kataru" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Subscribe on Substack ↗
          </a>
        </section>

      </div>
    </div>
  )
}
