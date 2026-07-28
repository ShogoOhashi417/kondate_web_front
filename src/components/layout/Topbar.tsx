import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth/AuthContext'

export function Topbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <strong>夕食献立・買い物リスト</strong>
      <button className="secondary" onClick={handleLogout}>
        ログアウト
      </button>
    </header>
  )
}
