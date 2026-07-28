import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日']

function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfWeek(date: Date): Date {
  const result = new Date(date)
  const weekday = (result.getDay() + 6) % 7 // 0 = Monday
  result.setDate(result.getDate() - weekday)
  result.setHours(0, 0, 0, 0)
  return result
}

export type WeekDay = {
  date: string
  label: string
}

export function useWeek() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dateParam = searchParams.get('date')

  const weekStart = useMemo(() => startOfWeek(dateParam ? new Date(dateParam) : new Date()), [dateParam])

  const days: WeekDay[] = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + index)
      return {
        date: toDateString(date),
        label: `${date.getMonth() + 1}/${date.getDate()}（${DAY_LABELS[index]}）`,
      }
    })
  }, [weekStart])

  const weekEnd = days[6]?.date ?? toDateString(weekStart)
  const anchorDate = days[0]?.date ?? toDateString(weekStart)

  function goToWeek(date: string) {
    setSearchParams({ date })
  }

  function goPrevWeek() {
    const date = new Date(weekStart)
    date.setDate(date.getDate() - 7)
    goToWeek(toDateString(date))
  }

  function goNextWeek() {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + 7)
    goToWeek(toDateString(date))
  }

  function goThisWeek() {
    setSearchParams({})
  }

  return {
    anchorDate,
    weekStart: days[0]?.date ?? toDateString(weekStart),
    weekEnd,
    days,
    goPrevWeek,
    goNextWeek,
    goThisWeek,
  }
}
