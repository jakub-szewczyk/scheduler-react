import { createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AuthProvider from './providers/AuthProvider'
import TanstackProvider from './providers/TanstackProvider'
import ThemeProvider from './providers/ThemeProvider'
import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export type Router = typeof router

const router = createRouter({
  routeTree,
})

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <ThemeProvider storageKey='theme' defaultTheme='dark'>
        <AuthProvider router={router}>
          <TanstackProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
