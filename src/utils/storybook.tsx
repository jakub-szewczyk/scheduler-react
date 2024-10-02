import type { PartialStoryFn, StoryContext } from '@storybook/types'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

declare module '@storybook/types' {
  interface Parameters {
    router?: {
      routes?: string[]
      initialIndex?: number
      initialEntries?: string[]
    }
  }
}

export const withRouter = (
  Story: PartialStoryFn,
  { parameters }: StoryContext
) => {
  const {
    routes = ['/'],
    initialIndex,
    initialEntries = ['/'],
  } = parameters?.router || {}

  const rootRoute = createRootRoute()

  rootRoute.addChildren(
    routes.map((path: string) =>
      createRoute({
        path,
        component: Story,
        getParentRoute: () => rootRoute,
      })
    )
  )

  return (
    <RouterProvider
      router={createRouter({
        history: createMemoryHistory({ initialIndex, initialEntries }),
        routeTree: rootRoute,
      })}
    />
  )
}
