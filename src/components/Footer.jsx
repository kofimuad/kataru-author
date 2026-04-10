import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="page-wrap">
        <div className="footer__inner">
          <div className="footer__brand">
            <svg
              className="footer__logo"
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
            <p className="footer__tagline">Writer · Poet · Facilitator</p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <Link to="/">Bio</Link>
            <Link to="/books">Books</Link>
            <Link to="/publications">Other publications</Link>
            <Link to="/interviews">Interviews</Link>
            <Link to="/facilitation">Others</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="footer__social">
            <a href="https://substack.com/@kataru" target="_blank" rel="noopener noreferrer">Newsletter ↗</a>
            <a href="https://www.instagram.com/kforkataru/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href="https://x.com/kforkataru" target="_blank" rel="noopener noreferrer">Twitter ↗</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Kataru Yahya. All rights reserved.</span>
          <Link to="/admin/login" className="footer__admin-link">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
