import { SignIn as ClerkSignIn, useClerk } from '@clerk/clerk-react'
import { createLazyFileRoute } from '@tanstack/react-router'

const SignIn = () => {
  const { loaded } = useClerk()

  return loaded ? <ClerkSignIn /> : <p>Loading...</p>
}

export const Route = createLazyFileRoute('/sign-in')({
  component: SignIn,
})
