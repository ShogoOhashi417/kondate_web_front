import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api/client'
import { useWeek } from '../hooks/useWeek'
import type { ShoppingListRow } from '../types/models'

export function ShoppingListPage() {
  const { anchorDate, weekStart, weekEnd, goPrevWeek, goNextWeek, goThisWeek } = useWeek()
  const [rows, setRows] = useState<ShoppingListRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    apiFetch<{ rows: ShoppingListRow[] }>('/shopping-list', { params: { date: anchorDate } })
      .then((res) => setRows(res.rows))
      .finally(() => setIsLoading(false))
  }, [anchorDate])

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>買い物リスト</h1>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>
            {weekStart} 〜 {weekEnd}
          </div>
        </div>
        <div className="toolbar">
          <button className="secondary" onClick={goPrevWeek}>前週</button>
          <button className="secondary" onClick={goThisWeek}>今週</button>
          <button className="secondary" onClick={goNextWeek}>次週</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>分類</th>
              <th>食材名</th>
              <th>数量</th>
              <th>単位</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="empty">読み込み中…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">この週の買い物はありません</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.food_id}-${row.unit}`}>
                  <td>{row.category}</td>
                  <td>{row.name}</td>
                  <td>{row.quantity}</td>
                  <td>{row.unit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
