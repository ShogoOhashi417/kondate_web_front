import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api/client'
import { FOOD_CATEGORIES, type Food, type FoodCategory } from '../types/models'

export function FoodListPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FoodCategory | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const load = useCallback(() => {
    setIsLoading(true)
    apiFetch<Food[]>('/foods', {
      params: { search, category: category === 'all' ? undefined : category },
    })
      .then(setFoods)
      .finally(() => setIsLoading(false))
  }, [search, category])

  useEffect(() => {
    const timer = setTimeout(load, 200)
    return () => clearTimeout(timer)
  }, [load])

  async function handleDelete(food: Food) {
    if (!confirm('この食材を削除しますか？')) return

    setErrorMessage(null)

    try {
      await apiFetch(`/foods/${food.id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : '削除に失敗しました。')
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>食材一覧</h1>
        <button className="primary" onClick={() => navigate('/foods/new')}>
          新規登録
        </button>
      </div>

      <div className="filter-row">
        <input
          placeholder="食材名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as FoodCategory | 'all')}>
          <option value="all">すべての分類</option>
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <div className="notice error">{errorMessage}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>食材名</th>
              <th>分類</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="empty">読み込み中…</td>
              </tr>
            ) : foods.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty">食材がありません</td>
              </tr>
            ) : (
              foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.category}</td>
                  <td>
                    <button className="secondary" onClick={() => navigate(`/foods/${food.id}/edit`)}>
                      編集
                    </button>{' '}
                    <button className="danger" onClick={() => handleDelete(food)}>
                      削除
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
