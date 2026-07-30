import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/api/client'
import type { Menu } from '../types/models'

export function MenuListPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const load = useCallback(() => {
    setIsLoading(true)
    apiFetch<Menu[]>('/menus', { params: { search } })
      .then(setMenus)
      .finally(() => setIsLoading(false))
  }, [search])

  useEffect(() => {
    const timer = setTimeout(load, 200)
    return () => clearTimeout(timer)
  }, [load])

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
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>メニュー名</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} className="empty">読み込み中…</td>
              </tr>
            ) : menus.length === 0 ? (
              <tr>
                <td colSpan={2} className="empty">メニューがありません</td>
              </tr>
            ) : (
              menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>
                    <button className="secondary" onClick={() => navigate(`/menus/${menu.id}/edit`)}>
                      編集
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
