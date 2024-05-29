import Heading3 from '@/components/common/Heading3/Heading3'
import Protected from '@/components/common/Protected/Protected'
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
