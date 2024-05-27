import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { identity } from 'lodash/fp'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: { getToken: identity, queryClient },
})

// eslint-disable-next-line react-refresh/only-export-components
const TanstackProvider = () => {
  const { getToken } = useAuth()

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ getToken }} />
    </QueryClientProvider>
  )
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <ClerkProvider
        routerPush={(to) => router.navigate({ to })}
        routerReplace={(to) => router.navigate({ to, replace: true })}
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <TanstackProvider />
      </ClerkProvider>
    </StrictMode>
  )
}
