import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/notes/$noteId/')({
  component: () => <div>Hello /projects/$projectId/notes/$noteId/!</div>,
})
