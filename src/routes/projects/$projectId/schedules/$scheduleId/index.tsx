import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/'
)({
  component: () => (
    <div>Hello /projects/$projectId/schedules/$scheduleId/!</div>
  ),
})
