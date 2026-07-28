import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '../../lib/api/client'
import type { Menu } from '../../types/models'

type Props = {
  date: string
  onClose: () => void
  onAdded: () => void
}

export function AddMenuModal({ date, onClose, onAdded }: Props) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    apiFetch<Menu[]>('/menus', { params: { status: 'active' } }).then(setMenus)
  }, [])

  async function handleConfirm() {
    if (!selectedMenuId) return

    setDuplicateNotice(null)
    setIsSubmitting(true)

    try {
      await apiFetch('/plans', { method: 'POST', body: { date, menu_id: selectedMenuId } })
      onAdded()
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setDuplicateNotice(err.errors?.menu_id?.[0] ?? '同じ日に同じメニューは登録できません。')
      } else {
        setDuplicateNotice(err instanceof ApiError ? err.message : '追加に失敗しました。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>追加するメニューを選択</h3>
        <div className="radio-list">
          {menus.map((menu) => (
            <label key={menu.id}>
              <input
                type="radio"
                name="menuChoice"
                value={menu.id}
                checked={selectedMenuId === menu.id}
                onChange={() => setSelectedMenuId(menu.id)}
              />
              <span>{menu.name}</span>
            </label>
          ))}
        </div>
        {duplicateNotice && <div className="notice">{duplicateNotice}</div>}
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>
            キャンセル
          </button>
          <button type="button" className="primary" onClick={handleConfirm} disabled={!selectedMenuId || isSubmitting}>
            追加
          </button>
        </div>
      </div>
    </div>
  )
}
