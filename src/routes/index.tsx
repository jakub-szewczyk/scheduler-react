import Protected from '@/components/common/Protected/Protected'
import Heading3 from '@/components/typography/Heading3/Heading3'
import { createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Dashboard'

export const Route = createFileRoute('/')({
  component: () => (
    <Protected>
      <Dashboard />
    </Protected>
  ),
})

function Dashboard() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  return <Heading3>{pageTitle}</Heading3>
}
