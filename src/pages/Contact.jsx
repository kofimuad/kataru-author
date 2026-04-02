import './InnerPage.css'
import './Contact.css'

export default function Contact() {
  return (
    <div className="inner-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="page-wrap">
        <header className="inner-page__header">
          <p className="inner-page__eyebrow">Kataru Yahya</p>
          <h1 className="inner-page__title">Contact</h1>
          <p className="inner-page__desc">
            For enquiries about workshops, commissions, readings, and press.
          </p>
        </header>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-block">
              <p className="contact-block__label">Email</p>
              <a href="mailto:yahyakataru@gmail.com" className="contact-block__value">
                yahyakataru@gmail.com
              </a>
            </div>
            <div className="contact-block">
              <p className="contact-block__label">Newsletter</p>
              <a href="https://substack.com/@kataru" target="_blank" rel="noopener noreferrer" className="contact-block__value">
                substack.com/@kataru ↗
              </a>
            </div>
            <div className="contact-block">
              <p className="contact-block__label">Instagram</p>
              <a href="https://www.instagram.com/kforkataru/" target="_blank" rel="noopener noreferrer" className="contact-block__value">
                @kforkataru ↗
              </a>
            </div>
            <div className="contact-block">
              <p className="contact-block__label">Twitter / X</p>
              <a href="https://x.com/kforkataru" target="_blank" rel="noopener noreferrer" className="contact-block__value">
                @kforkataru ↗
              </a>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={e => {
              e.preventDefault()
              const data = new FormData(e.target)
              const name = data.get('name') || ''
              const email = data.get('email') || ''
              const subject = data.get('subject') || 'Enquiry'
              const message = data.get('message') || ''
              const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n')
              window.location.href = `mailto:yahyakataru@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
          >
            <div className="field-group">
              <label className="field-label" htmlFor="name">Name</label>
              <input id="name" name="name" type="text" className="field-input" placeholder="Your name" required />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="field-input" placeholder="your@email.com" required />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="subject">Subject</label>
              <select id="subject" name="subject" className="field-select">
                <option value="Workshop enquiry">Workshop enquiry</option>
                <option value="Commission">Commission</option>
                <option value="Press / Interview">Press / Interview</option>
                <option value="Reading / Event">Reading / Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="message">Message</label>
              <textarea id="message" name="message" className="field-textarea" rows="6" placeholder="Your message…" required />
            </div>
            <button type="submit" className="btn btn-primary">Send message</button>
          </form>
        </div>
      </div>
    </div>
  )
}
