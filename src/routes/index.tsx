import Heading3 from '@/components/layout/Heading3/Heading3'
import { RedirectToSignIn } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Dashboard,
  beforeLoad: ({ context }) => {
    if (!context.isSignedIn) throw new Error('unauthorized')
  },
  errorComponent: (props) =>
    props.error.message === 'unauthorized' ? <RedirectToSignIn /> : null,
})

function Dashboard() {
  return <Heading3>Dashboard</Heading3>
}
