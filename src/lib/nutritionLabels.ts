import type { NutritionField } from '../types/models'

export const NUTRITION_LABELS: Record<NutritionField, { label: string; suffix: string }> = {
  calorie: { label: 'カロリー', suffix: 'kcal' },
  protein: { label: 'タンパク質', suffix: 'g' },
  fat: { label: '脂質', suffix: 'g' },
  carbohydrate: { label: '炭水化物', suffix: 'g' },
  vitamin_a: { label: 'ビタミンA', suffix: 'μg' },
  vitamin_b1: { label: 'ビタミンB1', suffix: 'mg' },
  vitamin_b2: { label: 'ビタミンB2', suffix: 'mg' },
  vitamin_b6: { label: 'ビタミンB6', suffix: 'mg' },
  vitamin_b12: { label: 'ビタミンB12', suffix: 'μg' },
  vitamin_c: { label: 'ビタミンC', suffix: 'mg' },
  vitamin_d: { label: 'ビタミンD', suffix: 'μg' },
  vitamin_e: { label: 'ビタミンE', suffix: 'mg' },
  vitamin_k: { label: 'ビタミンK', suffix: 'μg' },
  folic_acid: { label: '葉酸', suffix: 'μg' },
  calcium: { label: 'カルシウム', suffix: 'mg' },
  iron: { label: '鉄', suffix: 'mg' },
  zinc: { label: '亜鉛', suffix: 'mg' },
  magnesium: { label: 'マグネシウム', suffix: 'mg' },
  potassium: { label: 'カリウム', suffix: 'mg' },
}
