import Heading3 from '@/components/common/Heading3/Heading3'
import Protected from '@/components/common/Protected/Protected'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <Protected>
      <Dashboard />
    </Protected>
  ),
})

function Dashboard() {
  return <Heading3>Dashboard</Heading3>
}
