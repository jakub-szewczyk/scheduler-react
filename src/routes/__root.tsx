import Navbar from '@/components/layout/Navbar/Navbar'
import Sidebar from '@/components/layout/Sidebar/Sidebar'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
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
        <SignedIn>
          <Navbar />
          <div className='flex w-full'>
            <Sidebar />
            <main className='w-full p-4 bg-muted/40 sm:p-6'>
              <Outlet />
            </main>
          </div>
        </SignedIn>
        <SignedOut>
          <main className='flex items-center justify-center h-[calc(100vh-3rem)] p-4 bg-muted/40 sm:p-6'>
            <Outlet />
          </main>
        </SignedOut>
      </ClerkProvider>
      <Suspense>
        <TanStackRouterDevtools position='bottom-right' />
      </Suspense>
    </>
  )
}
