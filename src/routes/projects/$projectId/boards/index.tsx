import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/boards/')({
  component: () => <div>Hello /projects/$projectId/boards/!</div>,
})
