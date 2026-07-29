import type { Food } from '../../types/models'

export type RecipeRowValue = {
  food_id: number
  quantity: string
}

type Props = {
  rows: RecipeRowValue[]
  foods: Food[]
  onChange: (rows: RecipeRowValue[]) => void
}

export function RecipeRowEditor({ rows, foods, onChange }: Props) {
  function updateRow(index: number, patch: Partial<RecipeRowValue>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  function addRow() {
    onChange([...rows, { food_id: foods[0]?.id ?? 0, quantity: '' }])
  }

  return (
    <>
      <div>
        {rows.map((row, index) => (
          <div className="recipe-row" key={index}>
            <select
              value={row.food_id}
              onChange={(e) => updateRow(index, { food_id: Number(e.target.value) })}
            >
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              value={row.quantity}
              onChange={(e) => updateRow(index, { quantity: e.target.value })}
            />
            <span className="recipe-row-unit">
              {foods.find((food) => food.id === row.food_id)?.unit ?? ''}
            </span>
            <button type="button" className="danger" onClick={() => removeRow(index)}>
              削除
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="secondary" onClick={addRow}>
        ＋ 行を追加
      </button>
    </>
  )
}
