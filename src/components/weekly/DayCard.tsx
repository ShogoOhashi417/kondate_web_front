import type { PlanEntry } from '../../types/models'
import type { WeekDay } from '../../hooks/useWeek'

type Props = {
  day: WeekDay
  entries: PlanEntry[]
  onAddClick: (date: string) => void
  onRemove: (entryId: number) => void
}

export function DayCard({ day, entries, onAddClick, onRemove }: Props) {
  return (
    <div className="day-card">
      <div className="day-title">{day.label}</div>
      <div className="menu-list">
        {entries.length === 0 ? (
          <div className="empty">未登録</div>
        ) : (
          entries.map((entry) => (
            <div className="menu-chip" key={entry.id}>
              <span>{entry.menu?.name}</span>
              <button type="button" onClick={() => onRemove(entry.id)}>
                削除
              </button>
            </div>
          ))
        )}
      </div>
      <button type="button" className="add-menu-btn" onClick={() => onAddClick(day.date)}>
        ＋ メニューを追加
      </button>
    </div>
  )
}
