import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/events/new'
)({
  component: () => (
    <div>Hello /projects/$projectId/schedules/$scheduleId/events/new!</div>
  ),
})
