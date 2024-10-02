import { SignUp as ClerkSignUp, useClerk } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
})

function SignUp() {
  useDocumentTitle('Scheduler - Sign up')

  const { loaded } = useClerk()

  return loaded && <ClerkSignUp />
}
