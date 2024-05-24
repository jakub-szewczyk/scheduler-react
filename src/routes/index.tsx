import Heading3 from '@/components/layout/Heading3/Heading3'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  ),
})

function Dashboard() {
  return <Heading3>Dashboard</Heading3>
}
