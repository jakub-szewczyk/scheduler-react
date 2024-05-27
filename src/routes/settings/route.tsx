import { RedirectToSignIn } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: () => <div>Hello /settings!</div>,
  beforeLoad: ({ context }) => {
    if (!context.isSignedIn) throw new Error('unauthorized')
  },
  errorComponent: (props) =>
    props.error.message === 'unauthorized' ? <RedirectToSignIn /> : null,
})
