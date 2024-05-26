import Navbar from '@/components/layout/Navbar/Navbar'
import Sidebar from '@/components/layout/Sidebar/Sidebar'
import { cn } from '@/modules/common'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { useLocalStorage } from 'usehooks-ts'

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    'isSidebarCollapsed',
    true
  )

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
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
            <main
              className={cn(
                'w-[calc(100vw-3.5rem)] min-h-[calc(100vh-3rem)] mt-12 ml-14 p-4 bg-muted/40 transition-all duration-200 sm:p-6',
                !isSidebarCollapsed && 'w-[calc(100vw-13rem)] ml-52'
              )}
            >
              <Outlet />
            </main>
          </div>
        </SignedIn>
        <SignedOut>
          <main className='flex items-center justify-center h-screen p-4 bg-muted/40 sm:p-6'>
            <Outlet />
          </main>
        </SignedOut>
      </ClerkProvider>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  )
}
