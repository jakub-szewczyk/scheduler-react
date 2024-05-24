import { SignUp as ClerkSignUp, useClerk } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
})

function SignUp() {
  const { loaded } = useClerk()

  return loaded && <ClerkSignUp />
}
