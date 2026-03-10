import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from "../shared/layouts/MainLayout";

// Lazy loading para code splitting
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const ProductoPage = lazy(() => import('@/features/producto/components/ProductoPage'))
const CategoriaPage = lazy(() => import('@/features/categoria/components/CategoriaPage'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cocoa-300 border-t-cocoa-700 rounded-full animate-spin" />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { 
            path: "/dashboard",
            element: (
              <Suspense fallback={<PageLoader />}>
              <DashboardPage />
              </Suspense>
            ),
          },
          { 
            path: '/productos', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProductoPage />
              </Suspense>
            )
          },
          { 
            path: '/categoria', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <CategoriaPage />
              </Suspense>
            )
          },
          // { path: '/ventas',    element: <VentasPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}