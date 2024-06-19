import { SignIn as ClerkSignIn, useClerk } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  useDocumentTitle('Scheduler - Sign in')

  const { loaded } = useClerk()

  return loaded && <ClerkSignIn />
}
