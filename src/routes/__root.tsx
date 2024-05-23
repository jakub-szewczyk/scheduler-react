import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'
import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from '@tanstack/react-router'
import { lazy } from 'react'

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) throw new Error('missing publishable key')

const RootLayout = () => {
  const navigate = useNavigate()

  return (
    <>
      <ClerkProvider
        routerPush={(to) => navigate({ to })}
        routerReplace={(to) => navigate({ to, replace: true })}
        publishableKey={PUBLISHABLE_KEY}
      >
        <header className='flex justify-end gap-x-2 px-6 py-4 bg-blue-50'>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link to='/sign-in'>Sign in</Link>
          </SignedOut>
          <SignedOut>
            <Link to='/sign-up'>Sign up</Link>
          </SignedOut>
        </header>
        <main className='p-6'>
          <Outlet />
        </main>
      </ClerkProvider>
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
