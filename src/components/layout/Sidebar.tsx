import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/weekly', label: '週間献立' },
  { to: '/shopping-list', label: '買い物リスト' },
  { to: '/menus', label: 'メニュー一覧' },
  { to: '/foods', label: '食材一覧' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>🍲 献立管理</h2>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
