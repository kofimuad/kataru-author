import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN

export default function AdminLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const navigate = useNavigate()

  const handleKey = (val) => {
    if (pin.length >= 4) return
    const next = pin + val
    setPin(next)
    setError(false)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === ADMIN_PIN) {
          sessionStorage.setItem('ky_admin', '1')
          sessionStorage.setItem('admin_pin', next)
          navigate('/admin')
        } else {
          setError(true)
          setShake(true)
          setPin('')
          setTimeout(() => setShake(false), 500)
        }
      }, 180)
    }
  }

  const del = () => setPin(p => p.slice(0, -1))
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="admin-login" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Admin</p>
        <h1 className="admin-login__title">Kataru Yahya</h1>
        <div className="admin-login__sub">Enter your PIN to continue</div>

        <div className={"admin-login__dots" + (shake ? " admin-login__dots--shake" : "")}>
          {[0,1,2,3].map(i => (
            <div key={i} className={"admin-login__dot" + (i < pin.length ? " admin-login__dot--filled" : "") + (error ? " admin-login__dot--error" : "")} />
          ))}
        </div>

        {error && <p className="admin-login__error">Incorrect PIN</p>}

        <div className="admin-login__keypad">
          {keys.map((k, i) => (
            <button
              key={i}
              className={"admin-login__key" + (k === "⌫" ? " admin-login__key--del" : "") + (!k ? " admin-login__key--empty" : "")}
              onClick={() => k === "⌫" ? del() : k ? handleKey(k) : null}
              disabled={!k}
              tabIndex={k ? 0 : -1}
            >{k}</button>
          ))}
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}.admin-login__dots--shake{animation:shake 0.4s ease}`}</style>
    </div>
  )
}
