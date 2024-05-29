import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { ReactNode } from '@tanstack/react-router'

interface ProtectedProps {
  children: ReactNode
}

const Protected = ({ children }: ProtectedProps) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
)

export default Protected
