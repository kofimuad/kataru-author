import { useEffect, useState } from 'react'
import { getContent } from '../lib/api'
import './InnerPage.css'

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent('books')
      .then(({ items }) => setBooks(items || []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="inner-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="page-wrap">
        <header className="inner-page__header">
          <p className="inner-page__eyebrow">Kataru Yahya</p>
          <h1 className="inner-page__title">Books</h1>
          {!loading && books.length > 0 && (
            <p className="inner-page__desc">{books.length} published work{books.length !== 1 ? 's' : ''}</p>
          )}
        </header>

        {loading && <p className="loading-line">Loading—</p>}
        {!loading && books.length === 0 && <p className="empty-state">No books listed yet.</p>}

        {!loading && books.length > 0 && (
          <div className="books-grid">
            {books.map(book => (
              <article key={book._id} className="book-card">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="book-card__cover" />
                ) : (
                  <div className="book-card__cover-placeholder">Cover</div>
                )}
                <h2 className="book-card__title">{book.title}</h2>
                {(book.publisher || book.year) && (
                  <p className="book-card__meta">{[book.publisher, book.year].filter(Boolean).join(' · ')}</p>
                )}
                {book.description && <p className="book-card__desc">{book.description}</p>}
                <div className="book-card__links">
                  {book.buyLink && <a href={book.buyLink} target="_blank" rel="noopener noreferrer" className="book-card__link">Buy ↗</a>}
                  {book.goodreadsLink && <a href={book.goodreadsLink} target="_blank" rel="noopener noreferrer" className="book-card__link">Goodreads ↗</a>}
                  {book.publisherLink && <a href={book.publisherLink} target="_blank" rel="noopener noreferrer" className="book-card__link">Publisher ↗</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
