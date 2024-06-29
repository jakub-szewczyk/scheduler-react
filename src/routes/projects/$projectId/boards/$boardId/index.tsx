import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/boards/$boardId/')({
  component: () => <div>Hello /projects/$projectId/boards/$boardId/!</div>,
})
