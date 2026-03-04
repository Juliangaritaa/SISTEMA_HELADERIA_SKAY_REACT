import * as React from 'react'
import { Toaster } from 'sonner'
import { AppRouter } from './routes/AppRouter'

export default function App() {

  return (
    <>
    <AppRouter />
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        style: {
          fontFamily: 'DM Sans, sans-serif',
          borderRadius: '12px',
          border: '1px solid rgba(201,154,82,0.2)',
        },
      }}
    />
    </>
  )
}
