import ThemeSelect from '@/components/common/ThemeSelect/ThemeSelect'
import Navbar from '@/components/layout/Navbar/Navbar'
import Sidebar from '@/components/layout/Sidebar/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/modules/common'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { useLocalStorage } from 'usehooks-ts'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    'isSidebarCollapsed',
    true
  )

  return (
    <>
      <SignedIn>
        <Navbar>
          <ThemeSelect dropdownMenuContentProps={{ align: 'end' }} />
          <UserButton afterSignOutUrl='/sign-in' />
        </Navbar>
        <div className='flex w-full'>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
          <main
            className={cn(
              'ml-14 mt-12 min-h-[calc(100vh-3rem)] w-[calc(100vw-3.5rem)] min-w-0 p-4 transition-[width,margin] duration-300 sm:p-6',
              !isSidebarCollapsed && 'ml-52 w-[calc(100vw-13rem)]'
            )}
          >
            <Outlet />
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <main className='flex h-screen items-center justify-center p-4 sm:p-6'>
          <Outlet />
        </main>
      </SignedOut>
      <Toaster />
      <ReactQueryDevtools />
    </>
  )
}
