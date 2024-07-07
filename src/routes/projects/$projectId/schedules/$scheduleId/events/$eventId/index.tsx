import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/events/$eventId/'
)({
  component: () => (
    <div>
      Hello /projects/$projectId/schedules/$scheduleId/events/$eventId/!
    </div>
  ),
})
