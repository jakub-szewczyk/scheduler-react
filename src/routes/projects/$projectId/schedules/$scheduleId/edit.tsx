import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/edit'
)({
  component: () => (
    <div>Hello /projects/$projectId/schedules/$scheduleId/edit!</div>
  ),
})
