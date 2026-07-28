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

export type Food = {
  id: number
  name: string
  category: FoodCategory
  created_at: string
  updated_at: string
  in_use?: boolean
}

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
