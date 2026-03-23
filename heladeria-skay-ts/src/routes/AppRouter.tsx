import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from "../shared/layouts/MainLayout";

// Lazy loading para code splitting
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const ProductoPage = lazy(() => import('@/features/producto/components/ProductoPage'))
const CategoriaPage = lazy(() => import('@/features/categoria/components/CategoriaPage'))
const VentasPage = lazy(() => import('@/features/ventas/components/VentasPage'))
const CajaPage = lazy(() => import('@/features/caja/components/CajaPage'))
const ReportePage = lazy(() => import('@/features/reporte/components/ReportePage'))
const UsuarioPage = lazy(() => import('@/features/usuario/components/UsuarioPage'))

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
          { 
            path: '/ventas', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <VentasPage />
              </Suspense>
            )
          },
          { 
            path: '/caja', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <CajaPage />
              </Suspense>
            )
          },
          { 
            path: '/reporte', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <ReportePage />
              </Suspense>
            )
          },
          { 
            path: '/usuarios', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <UsuarioPage />
              </Suspense>
            )
          },
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