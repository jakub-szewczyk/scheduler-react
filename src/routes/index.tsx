import Heading3 from '@/components/layout/Heading3/Heading3'
import Protected from '@/components/layout/Protected/Protected'
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
