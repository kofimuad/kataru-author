import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="page-wrap">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__name">Kataru Yahya</span>
            <p className="footer__tagline">Writer · Poet · Facilitator</p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <Link to="/">Bio</Link>
            <Link to="/books">Books</Link>
            <Link to="/publications">Publications</Link>
            <Link to="/interviews">Interviews</Link>
            <Link to="/facilitation">Facilitation</Link>
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
