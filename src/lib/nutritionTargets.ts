import type { Nutrition, NutritionField } from '../types/models'

// 「日本人の食事摂取基準」成人男女平均値をもとにした1人1日あたりの目安量。
// 週合計との比較に使うため人数分・7倍して週間の目標値とする。
const HOUSEHOLD_SIZE = 2

const DAILY_TARGETS: Record<NutritionField, number> = {
  calorie: 2200,
  protein: 65,
  fat: 60,
  carbohydrate: 320,
  vitamin_a: 750,
  vitamin_b1: 1.2,
  vitamin_b2: 1.4,
  vitamin_b6: 1.3,
  vitamin_b12: 2.4,
  vitamin_c: 100,
  vitamin_d: 8.5,
  vitamin_e: 6.0,
  vitamin_k: 150,
  folic_acid: 240,
  calcium: 700,
  iron: 9,
  zinc: 9,
  magnesium: 320,
  potassium: 2500,
}

export const WEEKLY_NUTRITION_TARGETS: Record<NutritionField, number> = Object.fromEntries(
  Object.entries(DAILY_TARGETS).map(([field, value]) => [field, value * 7 * HOUSEHOLD_SIZE]),
) as Record<NutritionField, number>

export function nutritionTargetPercent(field: NutritionField, total: Nutrition): number {
  const target = WEEKLY_NUTRITION_TARGETS[field]
  const value = Number(total[field])
  if (!target || Number.isNaN(value)) return 0
  return (value / target) * 100
}
