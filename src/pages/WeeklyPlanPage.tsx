import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/api/client'
import { useWeek } from '../hooks/useWeek'
import type { PlanEntry } from '../types/models'
import { DayCard } from '../components/weekly/DayCard'
import { AddMenuModal } from '../components/weekly/AddMenuModal'

export function WeeklyPlanPage() {
  const { anchorDate, weekStart, weekEnd, days, goPrevWeek, goNextWeek, goThisWeek } = useWeek()
  const [entries, setEntries] = useState<PlanEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalDate, setModalDate] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadEntries = useCallback(() => {
    setIsLoading(true)
    apiFetch<{ entries: PlanEntry[] }>('/plans', { params: { date: anchorDate } })
      .then((res) => setEntries(res.entries))
      .finally(() => setIsLoading(false))
  }, [anchorDate])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  async function handleRemove(entryId: number) {
    await apiFetch(`/plans/${entryId}`, { method: 'DELETE' })
    loadEntries()
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>週間献立</h1>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>
            {weekStart} 〜 {weekEnd}
          </div>
        </div>
        <div className="toolbar">
          <button className="secondary" onClick={goPrevWeek}>前週</button>
          <button className="secondary" onClick={goThisWeek}>今週</button>
          <button className="secondary" onClick={goNextWeek}>次週</button>
          <button className="primary" onClick={() => navigate(`/shopping-list?date=${anchorDate}`)}>
            買い物リストを見る
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="empty">読み込み中…</div>
      ) : (
        <div className="week-grid">
          {days.map((day) => (
            <DayCard
              key={day.date}
              day={day}
              entries={entries.filter((entry) => entry.date === day.date)}
              onAddClick={setModalDate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {modalDate && (
        <AddMenuModal
          date={modalDate}
          onClose={() => setModalDate(null)}
          onAdded={() => {
            setModalDate(null)
            loadEntries()
          }}
        />
      )}
    </section>
  )
}
