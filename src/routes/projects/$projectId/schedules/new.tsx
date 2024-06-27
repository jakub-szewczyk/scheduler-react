import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/schedules/new')({
  component: () => <div>Hello /projects/$projectId/schedules/new!</div>,
})
