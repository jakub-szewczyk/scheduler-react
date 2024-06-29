import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/projects/$projectId/boards/$boardId/edit'
)({
  component: () => <div>Hello /projects/$projectId/boards/$boardId/edit!</div>,
})
