import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api/client'
import { useWeek } from '../hooks/useWeek'
import { NUTRITION_LABELS } from '../lib/nutritionLabels'
import { NUTRITION_FIELDS, type NutritionSummaryResponse } from '../types/models'

export function NutritionPage() {
  const { anchorDate, weekStart, weekEnd, days, goPrevWeek, goNextWeek, goThisWeek } = useWeek()
  const [summary, setSummary] = useState<NutritionSummaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    apiFetch<NutritionSummaryResponse>('/nutrition', { params: { date: anchorDate } })
      .then(setSummary)
      .finally(() => setIsLoading(false))
  }, [anchorDate])

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>栄養バランス</h1>
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
              <th>栄養素</th>
              {days.map((day) => (
                <th key={day.date}>{day.label}</th>
              ))}
              <th>週合計</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || !summary ? (
              <tr>
                <td colSpan={days.length + 2} className="empty">読み込み中…</td>
              </tr>
            ) : (
              NUTRITION_FIELDS.map((field) => (
                <tr key={field}>
                  <td>
                    {NUTRITION_LABELS[field].label}（{NUTRITION_LABELS[field].suffix}）
                  </td>
                  {days.map((day) => {
                    const dayNutrition = summary.days.find((d) => d.date === day.date)
                    return <td key={day.date}>{dayNutrition?.nutrition[field] ?? 0}</td>
                  })}
                  <td>
                    <strong>{summary.week_total[field]}</strong>
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
