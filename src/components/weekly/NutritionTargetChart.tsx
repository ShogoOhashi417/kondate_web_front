import { NUTRITION_FIELDS, type Nutrition } from '../../types/models'
import { NUTRITION_LABELS } from '../../lib/nutritionLabels'
import { nutritionTargetPercent } from '../../lib/nutritionTargets'

type Props = {
  nutritionTotal: Nutrition
}

// 目標達成率100%を示す位置。バーの右端ではなく3/4付近に配置する
const TARGET_MARK_POSITION = 75

export function NutritionTargetChart({ nutritionTotal }: Props) {
  return (
    <div className="nutrition-chart">
      <h2 className="section-title">栄養素の目標達成率（週間）</h2>
      <div className="nutrition-bar-list">
        {NUTRITION_FIELDS.map((field) => {
          const percent = nutritionTargetPercent(field, nutritionTotal)
          const barWidth = Math.min(percent * (TARGET_MARK_POSITION / 100), 100)
          return (
            <div className="nutrition-bar-row" key={field}>
              <div className="nutrition-bar-label">{NUTRITION_LABELS[field].label}</div>
              <div className="nutrition-bar-track">
                <div
                  className={`nutrition-bar-fill${percent >= 100 ? ' is-full' : ''}`}
                  style={{ width: `${barWidth}%` }}
                />
                <div className="nutrition-bar-target-mark" style={{ left: `${TARGET_MARK_POSITION}%` }} />
              </div>
              <div className="nutrition-bar-percent">{Math.round(percent)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
