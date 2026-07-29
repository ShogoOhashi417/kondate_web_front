import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext'
import { ApiError } from '../lib/api/client'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/weekly'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/weekly', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'ログインに失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-wrap">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">🍲</div>
          <h1>楽・こんだて</h1>
          <p>メールアドレスとパスワードでログイン</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="notice error">{error}</div>}
          <button type="submit" className="primary" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? 'ログイン中…' : 'ログイン'}
          </button>
        </form>
      </div>
    </section>
  )
}
