import Heading3 from '@/components/layout/Heading3/Heading3'
import Protected from '@/components/layout/Protected/Protected'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: () => (
    <Protected>
      <Settings />
    </Protected>
  ),
})

function Settings() {
  return <Heading3>Settings</Heading3>
}
