import { ClerkProvider } from '@clerk/clerk-react'
import { createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
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
        <ClerkProvider
          routerPush={(to) => router.navigate({ to })}
          routerReplace={(to) => router.navigate({ to, replace: true })}
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        >
          <TanstackProvider router={router} />
        </ClerkProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
