import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { WeeklyPlanPage } from './pages/WeeklyPlanPage'
import { ShoppingListPage } from './pages/ShoppingListPage'
import { MenuListPage } from './pages/MenuListPage'
import { MenuEditPage } from './pages/MenuEditPage'
import { FoodListPage } from './pages/FoodListPage'
import { FoodEditPage } from './pages/FoodEditPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <WeeklyPlanPage /> },
          { path: 'weekly', element: <WeeklyPlanPage /> },
          { path: 'shopping-list', element: <ShoppingListPage /> },
          { path: 'menus', element: <MenuListPage /> },
          { path: 'menus/new', element: <MenuEditPage /> },
          { path: 'menus/:id/edit', element: <MenuEditPage /> },
          { path: 'foods', element: <FoodListPage /> },
          { path: 'foods/new', element: <FoodEditPage /> },
          { path: 'foods/:id/edit', element: <FoodEditPage /> },
        ],
      },
    ],
  },
])
