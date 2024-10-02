import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/projects/$projectId/boards/$boardId/statuses/new'
)({
  component: () => (
    <div>Hello /projects/$projectId/boards/$boardId/statuses/new!</div>
  ),
})
