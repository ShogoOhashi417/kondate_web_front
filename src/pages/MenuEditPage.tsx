import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api/client'
import type { Food, Menu } from '../types/models'
import { RecipeRowEditor, type RecipeRowValue } from '../components/menu/RecipeRowEditor'

export function MenuEditPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [foods, setFoods] = useState<Food[]>([])
  const [name, setName] = useState('')
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
      setRecipeRows(
        (menu.recipe_items ?? []).map((item) => ({
          food_id: item.food_id,
          quantity: item.quantity,
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
      .filter((row) => row.food_id)
      .map((row) => ({ food_id: row.food_id, quantity: Number(row.quantity) }))

    const foodIds = recipe.map((r) => r.food_id)
    if (new Set(foodIds).size !== foodIds.length) {
      setError('同じ食材は重複登録できません。')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing) {
        await apiFetch(`/menus/${id}`, { method: 'PUT', body: { name, recipe } })
      } else {
        await apiFetch('/menus', { method: 'POST', body: { name, recipe } })
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
