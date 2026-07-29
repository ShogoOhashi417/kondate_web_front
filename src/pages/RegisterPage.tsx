import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext'
import { ApiError } from '../lib/api/client'

export function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/weekly" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません。')
      return
    }

    setIsSubmitting(true)

    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/weekly', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '登録に失敗しました。')
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
          <p>新規アカウントを作成</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">名前</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
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
              minLength={8}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="passwordConfirmation">パスワード（確認）</label>
            <input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              minLength={8}
              required
            />
          </div>
          {error && <div className="notice error">{error}</div>}
          <button type="submit" className="primary" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? '登録中…' : '登録する'}
          </button>
        </form>
        <p className="auth-switch">
          すでにアカウントをお持ちですか？ <Link to="/login">ログイン</Link>
        </p>
      </div>
    </section>
  )
}
