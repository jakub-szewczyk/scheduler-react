import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/boards/new')({
  component: () => <div>Hello /projects/$projectId/boards/new!</div>,
})
