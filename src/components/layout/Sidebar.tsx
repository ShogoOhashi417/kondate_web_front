import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/weekly', label: '週間献立' },
  { to: '/shopping-list', label: '買い物リスト' },
  { to: '/menus', label: 'メニュー一覧' },
  { to: '/foods', label: '食材一覧' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🍲 献立管理</h2>
        <button
          type="button"
          className="hamburger-button"
          aria-label="メニューを開閉する"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className={`nav${isOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
