import Navbar from '@/components/layout/Navbar/Navbar'
import Sidebar from '@/components/layout/Sidebar/Sidebar'
import { cn } from '@/modules/common'
import ThemeProvider from '@/providers/ThemeProvider'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { GetToken } from '@clerk/types'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
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

type RootRouteContext = {
  getToken: GetToken
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: Root,
})

function Root() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    'isSidebarCollapsed',
    true
  )

  return (
    <>
      <ThemeProvider storageKey='theme' defaultTheme='dark'>
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
      </ThemeProvider>
      <ReactQueryDevtools />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  )
}
