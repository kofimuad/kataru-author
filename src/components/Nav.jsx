import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

const links = [
  { label: 'Bio',              path: '/' },
  { label: 'Books',            path: '/books' },
  { label: 'Other publications', path: '/publications' },
  { label: 'Interviews',       path: '/interviews' },
  { label: 'Others',           path: '/facilitation' },
  { label: 'Contact',          path: '/contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} role="navigation">
      <div className="nav__inner">

        {/* Wordmark */}
        <NavLink to="/" className="nav__wordmark">
          <svg
            className="nav__logo"
            viewBox="0 0 360 300"
            role="img"
            aria-label="Kataru Yahya logo"
          >
            <title>Kataru Yahya logo</title>
            <g fill="none" stroke="#ead6a8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="180" cy="120" rx="88" ry="112" />
              <ellipse cx="180" cy="120" rx="72" ry="96" />
              <path d="M78 235h204" />
              <path d="M84 235c8-7 16-13 24-18 8 5 16 11 24 18-8 7-16 13-24 18-8-5-16-11-24-18Z" />
              <path d="M276 235c8-7 16-13 24-18 8 5 16 11 24 18-8 7-16 13-24 18-8-5-16-11-24-18Z" />
              <path d="M142 235c6-7 9-14 9-22 0-8-3-14-10-19" />
              <path d="M216 235c-6-7-9-14-9-22 0-8 3-14 10-19" />
            </g>
            <text
              x="180"
              y="150"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="104"
              fill="#ead6a8"
              fontWeight="400"
            >
              K
            </text>
          </svg>
          <span>Kataru Yahya</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="nav__links" role="list">
          {links.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `nav__link${isActive ? ' nav__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav__drawer${menuOpen ? ' nav__drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <ul role="list">
          {links.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `nav__drawer-link${isActive ? ' nav__drawer-link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
