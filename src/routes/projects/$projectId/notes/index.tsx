import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/notes/')({
  component: () => <div>Hello /projects/$projectId/notes/!</div>,
})
