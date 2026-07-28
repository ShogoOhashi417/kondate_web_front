import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api/client'
import type { Food, Menu, MenuStatus } from '../types/models'
import { RecipeRowEditor, type RecipeRowValue } from '../components/menu/RecipeRowEditor'

export function MenuEditPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [foods, setFoods] = useState<Food[]>([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState<MenuStatus>('active')
  const [recipeRows, setRecipeRows] = useState<RecipeRowValue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    apiFetch<Food[]>('/foods').then(setFoods)
  }, [])

  useEffect(() => {
    if (!id) return

    apiFetch<Menu>(`/menus/${id}`).then((menu) => {
      setName(menu.name)
      setStatus(menu.status)
      setRecipeRows(
        (menu.recipe_items ?? []).map((item) => ({
          food_id: item.food_id,
          quantity: item.quantity,
          unit: item.unit,
        })),
      )
    })
  }, [id])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('メニュー名を入力してください。')
      return
    }

    const recipe = recipeRows
      .filter((row) => row.food_id && row.unit.trim())
      .map((row) => ({ food_id: row.food_id, quantity: Number(row.quantity), unit: row.unit.trim() }))

    const pairs = recipe.map((r) => `${r.food_id}-${r.unit}`)
    if (new Set(pairs).size !== pairs.length) {
      setError('同じ食材・同じ単位は重複登録できません。')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing) {
        await apiFetch(`/menus/${id}`, { method: 'PUT', body: { name, status, recipe } })
      } else {
        await apiFetch('/menus', { method: 'POST', body: { name, status, recipe } })
      }
      navigate('/menus')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '保存に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>{isEditing ? 'メニュー編集' : 'メニュー新規登録'}</h1>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="menuName">メニュー名</label>
          <input id="menuName" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：生姜焼き" />
        </div>
        <div className="field">
          <label htmlFor="menuStatus">利用状態</label>
          <select id="menuStatus" value={status} onChange={(e) => setStatus(e.target.value as MenuStatus)}>
            <option value="active">利用中</option>
            <option value="inactive">利用停止</option>
          </select>
        </div>

        <h3>レシピ（2人分）</h3>
        <RecipeRowEditor rows={recipeRows} foods={foods} onChange={setRecipeRows} />

        {error && <div className="notice error">{error}</div>}

        <div className="toolbar" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="button" className="secondary" onClick={() => navigate('/menus')}>
            キャンセル
          </button>
          <button type="submit" className="primary" disabled={isSubmitting}>
            保存
          </button>
        </div>
      </form>
    </section>
  )
}
