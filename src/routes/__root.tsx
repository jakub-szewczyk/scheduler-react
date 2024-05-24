import Navbar from '@/components/layout/Navbar/Navbar'
import Sidebar from '@/components/layout/Sidebar/Sidebar'
import { ClerkProvider } from '@clerk/clerk-react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  const navigate = Route.useNavigate()

  return (
    <>
      <ClerkProvider
        routerPush={(to) => navigate({ to })}
        routerReplace={(to) => navigate({ to, replace: true })}
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <Navbar />
        <div className='flex w-full'>
          <Sidebar />
          <main className='w-full p-4 bg-muted/40 sm:p-6'>
            <Outlet />
          </main>
        </div>
      </ClerkProvider>
      <Suspense>
        <TanStackRouterDevtools position='bottom-right' />
      </Suspense>
    </>
  )
}
