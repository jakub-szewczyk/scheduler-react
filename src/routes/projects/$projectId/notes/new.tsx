import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/notes/new')({
  component: () => <div>Hello /projects/$projectId/notes/new!</div>,
})
