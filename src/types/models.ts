export const FOOD_CATEGORIES = [
  '肉',
  '魚',
  '野菜',
  '卵・乳製品',
  '大豆製品',
  '米・パン・麺類',
  '調味料',
  'その他',
] as const

export type FoodCategory = (typeof FOOD_CATEGORIES)[number]

export const MENU_STATUSES = ['active', 'inactive'] as const

export type MenuStatus = (typeof MENU_STATUSES)[number]

export const NUTRITION_FIELDS = [
  'calorie',
  'protein',
  'fat',
  'carbohydrate',
  'vitamin_a',
  'vitamin_b1',
  'vitamin_b2',
  'vitamin_b6',
  'vitamin_b12',
  'vitamin_c',
  'vitamin_d',
  'vitamin_e',
  'vitamin_k',
  'folic_acid',
  'calcium',
  'iron',
  'zinc',
  'magnesium',
  'potassium',
] as const

export type NutritionField = (typeof NUTRITION_FIELDS)[number]

export type Nutrition = Record<NutritionField, string>

export type Food = {
  id: number
  name: string
  category: FoodCategory
  unit: string
  created_at: string
  updated_at: string
  in_use?: boolean
} & Nutrition

export type RecipeItem = {
  id: number
  menu_id: number
  food_id: number
  quantity: string
  unit: string
  food?: Food
}

export type Menu = {
  id: number
  name: string
  status: MenuStatus
  created_at: string
  updated_at: string
  recipe_items?: RecipeItem[]
}

export type PlanEntry = {
  id: number
  date: string
  menu_id: number
  sort_order: number
  menu?: Menu
}

export type DayNutrition = {
  date: string
  nutrition: Nutrition
}

export type NutritionSummaryResponse = {
  week_start: string
  week_end: string
  days: DayNutrition[]
  week_total: Nutrition
}

export type ShoppingListRow = {
  food_id: number
  name: string
  category: FoodCategory
  quantity: number
  unit: string
}

export type User = {
  id: number
  name: string
  email: string
}
