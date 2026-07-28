import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/api/client'
import type { Menu, MenuStatus } from '../types/models'

export function MenuListPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<MenuStatus | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const load = useCallback(() => {
    setIsLoading(true)
    apiFetch<Menu[]>('/menus', {
      params: { search, status: status === 'all' ? undefined : status },
    })
      .then(setMenus)
      .finally(() => setIsLoading(false))
  }, [search, status])

  useEffect(() => {
    const timer = setTimeout(load, 200)
    return () => clearTimeout(timer)
  }, [load])

  async function toggleStatus(menu: Menu) {
    const nextStatus: MenuStatus = menu.status === 'active' ? 'inactive' : 'active'
    await apiFetch(`/menus/${menu.id}/status`, { method: 'PATCH', body: { status: nextStatus } })
    load()
  }

  return (
    <section>
      <div className="page-header">
        <h1>メニュー一覧</h1>
        <button className="primary" onClick={() => navigate('/menus/new')}>
          新規登録
        </button>
      </div>

      <div className="filter-row">
        <input
          placeholder="メニュー名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as MenuStatus | 'all')}>
          <option value="all">すべての状態</option>
          <option value="active">利用中</option>
          <option value="inactive">利用停止</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>メニュー名</th>
              <th>利用状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="empty">読み込み中…</td>
              </tr>
            ) : menus.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty">メニューがありません</td>
              </tr>
            ) : (
              menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>
                    <span className={`badge ${menu.status === 'inactive' ? 'off' : ''}`}>
                      {menu.status === 'active' ? '利用中' : '利用停止'}
                    </span>
                  </td>
                  <td>
                    <button className="secondary" onClick={() => navigate(`/menus/${menu.id}/edit`)}>
                      編集
                    </button>{' '}
                    <button className="secondary" onClick={() => toggleStatus(menu)}>
                      {menu.status === 'active' ? '利用停止' : '再開'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
