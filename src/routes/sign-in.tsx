import { SignIn as ClerkSignIn, useClerk } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  const { loaded } = useClerk()

  return loaded && <ClerkSignIn />
}
