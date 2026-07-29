import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api/client'
import { NUTRITION_LABELS } from '../lib/nutritionLabels'
import {
  FOOD_CATEGORIES,
  NUTRITION_FIELDS,
  type Food,
  type FoodCategory,
  type Nutrition,
  type NutritionField,
} from '../types/models'

function emptyNutrition(): Nutrition {
  return Object.fromEntries(NUTRITION_FIELDS.map((field) => [field, ''])) as Nutrition
}

export function FoodEditPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<FoodCategory>(FOOD_CATEGORIES[0])
  const [unit, setUnit] = useState('')
  const [nutrition, setNutrition] = useState<Nutrition>(emptyNutrition)
  const [inUse, setInUse] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return

    apiFetch<Food>(`/foods/${id}`).then((food) => {
      setName(food.name)
      setCategory(food.category)
      setUnit(food.unit)
      setNutrition(Object.fromEntries(NUTRITION_FIELDS.map((field) => [field, food[field]])) as Nutrition)
      setInUse(Boolean(food.in_use))
    })
  }, [id])

  function updateNutrition(field: NutritionField, value: string) {
    setNutrition((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('食材名を入力してください。')
      return
    }

    if (!unit.trim()) {
      setError('単位を入力してください。')
      return
    }

    setIsSubmitting(true)

    const body = { name, category, unit, ...nutrition }

    try {
      if (isEditing) {
        await apiFetch(`/foods/${id}`, { method: 'PUT', body })
      } else {
        await apiFetch('/foods', { method: 'POST', body })
      }
      navigate('/foods')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '保存に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>{isEditing ? '食材編集' : '食材新規登録'}</h1>
      </div>
      <form className="form-card" style={{ maxWidth: 780 }} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="foodName">食材名</label>
          <input id="foodName" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：玉ねぎ" />
        </div>
        <div className="field">
          <label htmlFor="foodCategory">分類</label>
          <select id="foodCategory" value={category} onChange={(e) => setCategory(e.target.value as FoodCategory)}>
            {FOOD_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="foodUnit">単位</label>
          <input
            id="foodUnit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="例：100g、1個"
          />
        </div>

        <h2 className="section-title">栄養成分（単位あたり）</h2>
        <div className="field-grid">
          {NUTRITION_FIELDS.map((field) => (
            <div className="field" key={field}>
              <label htmlFor={`nutrition-${field}`}>
                {NUTRITION_LABELS[field].label}（{NUTRITION_LABELS[field].suffix}）
              </label>
              <input
                id={`nutrition-${field}`}
                type="number"
                step="0.01"
                min="0"
                value={nutrition[field]}
                onChange={(e) => updateNutrition(field, e.target.value)}
              />
            </div>
          ))}
        </div>

        {inUse && (
          <div className="notice">
            この食材はレシピで使用されています。削除するには、先にレシピから削除してください。
          </div>
        )}
        {error && <div className="notice error">{error}</div>}
        <div className="toolbar" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="button" className="secondary" onClick={() => navigate('/foods')}>
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
