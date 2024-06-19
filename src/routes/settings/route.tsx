import Protected from '@/components/common/Protected/Protected'
import Heading3 from '@/components/typography/Heading3/Heading3'
import { createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Settings'

export const Route = createFileRoute('/settings')({
  component: () => (
    <Protected>
      <Settings />
    </Protected>
  ),
})

function Settings() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  return <Heading3>{pageTitle}</Heading3>
}
