import Protected from '@/components/common/Protected/Protected'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId')({
  component: () => (
    <Protected>
      <Project />
    </Protected>
  ),
})

function Project() {
  const { projectId } = Route.useParams()

  return <div>{projectId}</div>
}
