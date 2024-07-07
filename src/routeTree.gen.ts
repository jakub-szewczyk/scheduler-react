/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignUpImport } from './routes/sign-up'
import { Route as SignInImport } from './routes/sign-in'
import { Route as SettingsRouteImport } from './routes/settings/route'
import { Route as IndexImport } from './routes/index'
import { Route as ProjectsIndexImport } from './routes/projects/index'
import { Route as ProjectsNewImport } from './routes/projects/new'
import { Route as ProjectsProjectIdIndexImport } from './routes/projects/$projectId/index'
import { Route as ProjectsProjectIdEditImport } from './routes/projects/$projectId/edit'
import { Route as ProjectsProjectIdSchedulesIndexImport } from './routes/projects/$projectId/schedules/index'
import { Route as ProjectsProjectIdNotesIndexImport } from './routes/projects/$projectId/notes/index'
import { Route as ProjectsProjectIdBoardsIndexImport } from './routes/projects/$projectId/boards/index'
import { Route as ProjectsProjectIdSchedulesNewImport } from './routes/projects/$projectId/schedules/new'
import { Route as ProjectsProjectIdNotesNewImport } from './routes/projects/$projectId/notes/new'
import { Route as ProjectsProjectIdBoardsNewImport } from './routes/projects/$projectId/boards/new'
import { Route as ProjectsProjectIdSchedulesScheduleIdIndexImport } from './routes/projects/$projectId/schedules/$scheduleId/index'
import { Route as ProjectsProjectIdNotesNoteIdIndexImport } from './routes/projects/$projectId/notes/$noteId/index'
import { Route as ProjectsProjectIdBoardsBoardIdIndexImport } from './routes/projects/$projectId/boards/$boardId/index'
import { Route as ProjectsProjectIdSchedulesScheduleIdEditImport } from './routes/projects/$projectId/schedules/$scheduleId/edit'
import { Route as ProjectsProjectIdNotesNoteIdEditImport } from './routes/projects/$projectId/notes/$noteId/edit'
import { Route as ProjectsProjectIdBoardsBoardIdEditImport } from './routes/projects/$projectId/boards/$boardId/edit'
import { Route as ProjectsProjectIdSchedulesScheduleIdEventsIndexImport } from './routes/projects/$projectId/schedules/$scheduleId/events/index'
import { Route as ProjectsProjectIdSchedulesScheduleIdEventsNewImport } from './routes/projects/$projectId/schedules/$scheduleId/events/new'
import { Route as ProjectsProjectIdSchedulesScheduleIdEventsEventIdIndexImport } from './routes/projects/$projectId/schedules/$scheduleId/events/$eventId/index'

// Create/Update Routes

const SignUpRoute = SignUpImport.update({
  path: '/sign-up',
  getParentRoute: () => rootRoute,
} as any)

const SignInRoute = SignInImport.update({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const SettingsRouteRoute = SettingsRouteImport.update({
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsIndexRoute = ProjectsIndexImport.update({
  path: '/projects/',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsNewRoute = ProjectsNewImport.update({
  path: '/projects/new',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsProjectIdIndexRoute = ProjectsProjectIdIndexImport.update({
  path: '/projects/$projectId/',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsProjectIdEditRoute = ProjectsProjectIdEditImport.update({
  path: '/projects/$projectId/edit',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsProjectIdSchedulesIndexRoute =
  ProjectsProjectIdSchedulesIndexImport.update({
    path: '/projects/$projectId/schedules/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdNotesIndexRoute =
  ProjectsProjectIdNotesIndexImport.update({
    path: '/projects/$projectId/notes/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdBoardsIndexRoute =
  ProjectsProjectIdBoardsIndexImport.update({
    path: '/projects/$projectId/boards/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdSchedulesNewRoute =
  ProjectsProjectIdSchedulesNewImport.update({
    path: '/projects/$projectId/schedules/new',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdNotesNewRoute = ProjectsProjectIdNotesNewImport.update({
  path: '/projects/$projectId/notes/new',
  getParentRoute: () => rootRoute,
} as any)

const ProjectsProjectIdBoardsNewRoute = ProjectsProjectIdBoardsNewImport.update(
  {
    path: '/projects/$projectId/boards/new',
    getParentRoute: () => rootRoute,
  } as any
)

const ProjectsProjectIdSchedulesScheduleIdIndexRoute =
  ProjectsProjectIdSchedulesScheduleIdIndexImport.update({
    path: '/projects/$projectId/schedules/$scheduleId/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdNotesNoteIdIndexRoute =
  ProjectsProjectIdNotesNoteIdIndexImport.update({
    path: '/projects/$projectId/notes/$noteId/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdBoardsBoardIdIndexRoute =
  ProjectsProjectIdBoardsBoardIdIndexImport.update({
    path: '/projects/$projectId/boards/$boardId/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdSchedulesScheduleIdEditRoute =
  ProjectsProjectIdSchedulesScheduleIdEditImport.update({
    path: '/projects/$projectId/schedules/$scheduleId/edit',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdNotesNoteIdEditRoute =
  ProjectsProjectIdNotesNoteIdEditImport.update({
    path: '/projects/$projectId/notes/$noteId/edit',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdBoardsBoardIdEditRoute =
  ProjectsProjectIdBoardsBoardIdEditImport.update({
    path: '/projects/$projectId/boards/$boardId/edit',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdSchedulesScheduleIdEventsIndexRoute =
  ProjectsProjectIdSchedulesScheduleIdEventsIndexImport.update({
    path: '/projects/$projectId/schedules/$scheduleId/events/',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdSchedulesScheduleIdEventsNewRoute =
  ProjectsProjectIdSchedulesScheduleIdEventsNewImport.update({
    path: '/projects/$projectId/schedules/$scheduleId/events/new',
    getParentRoute: () => rootRoute,
  } as any)

const ProjectsProjectIdSchedulesScheduleIdEventsEventIdIndexRoute =
  ProjectsProjectIdSchedulesScheduleIdEventsEventIdIndexImport.update({
    path: '/projects/$projectId/schedules/$scheduleId/events/$eventId/',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsRouteImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    '/sign-up': {
      id: '/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof SignUpImport
      parentRoute: typeof rootRoute
    }
    '/projects/new': {
      id: '/projects/new'
      path: '/projects/new'
      fullPath: '/projects/new'
      preLoaderRoute: typeof ProjectsNewImport
      parentRoute: typeof rootRoute
    }
    '/projects/': {
      id: '/projects/'
      path: '/projects'
      fullPath: '/projects'
      preLoaderRoute: typeof ProjectsIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/edit': {
      id: '/projects/$projectId/edit'
      path: '/projects/$projectId/edit'
      fullPath: '/projects/$projectId/edit'
      preLoaderRoute: typeof ProjectsProjectIdEditImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/': {
      id: '/projects/$projectId/'
      path: '/projects/$projectId'
      fullPath: '/projects/$projectId'
      preLoaderRoute: typeof ProjectsProjectIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/boards/new': {
      id: '/projects/$projectId/boards/new'
      path: '/projects/$projectId/boards/new'
      fullPath: '/projects/$projectId/boards/new'
      preLoaderRoute: typeof ProjectsProjectIdBoardsNewImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/notes/new': {
      id: '/projects/$projectId/notes/new'
      path: '/projects/$projectId/notes/new'
      fullPath: '/projects/$projectId/notes/new'
      preLoaderRoute: typeof ProjectsProjectIdNotesNewImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/new': {
      id: '/projects/$projectId/schedules/new'
      path: '/projects/$projectId/schedules/new'
      fullPath: '/projects/$projectId/schedules/new'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesNewImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/boards/': {
      id: '/projects/$projectId/boards/'
      path: '/projects/$projectId/boards'
      fullPath: '/projects/$projectId/boards'
      preLoaderRoute: typeof ProjectsProjectIdBoardsIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/notes/': {
      id: '/projects/$projectId/notes/'
      path: '/projects/$projectId/notes'
      fullPath: '/projects/$projectId/notes'
      preLoaderRoute: typeof ProjectsProjectIdNotesIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/': {
      id: '/projects/$projectId/schedules/'
      path: '/projects/$projectId/schedules'
      fullPath: '/projects/$projectId/schedules'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/boards/$boardId/edit': {
      id: '/projects/$projectId/boards/$boardId/edit'
      path: '/projects/$projectId/boards/$boardId/edit'
      fullPath: '/projects/$projectId/boards/$boardId/edit'
      preLoaderRoute: typeof ProjectsProjectIdBoardsBoardIdEditImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/notes/$noteId/edit': {
      id: '/projects/$projectId/notes/$noteId/edit'
      path: '/projects/$projectId/notes/$noteId/edit'
      fullPath: '/projects/$projectId/notes/$noteId/edit'
      preLoaderRoute: typeof ProjectsProjectIdNotesNoteIdEditImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/$scheduleId/edit': {
      id: '/projects/$projectId/schedules/$scheduleId/edit'
      path: '/projects/$projectId/schedules/$scheduleId/edit'
      fullPath: '/projects/$projectId/schedules/$scheduleId/edit'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesScheduleIdEditImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/boards/$boardId/': {
      id: '/projects/$projectId/boards/$boardId/'
      path: '/projects/$projectId/boards/$boardId'
      fullPath: '/projects/$projectId/boards/$boardId'
      preLoaderRoute: typeof ProjectsProjectIdBoardsBoardIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/notes/$noteId/': {
      id: '/projects/$projectId/notes/$noteId/'
      path: '/projects/$projectId/notes/$noteId'
      fullPath: '/projects/$projectId/notes/$noteId'
      preLoaderRoute: typeof ProjectsProjectIdNotesNoteIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/$scheduleId/': {
      id: '/projects/$projectId/schedules/$scheduleId/'
      path: '/projects/$projectId/schedules/$scheduleId'
      fullPath: '/projects/$projectId/schedules/$scheduleId'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesScheduleIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/$scheduleId/events/new': {
      id: '/projects/$projectId/schedules/$scheduleId/events/new'
      path: '/projects/$projectId/schedules/$scheduleId/events/new'
      fullPath: '/projects/$projectId/schedules/$scheduleId/events/new'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesScheduleIdEventsNewImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/$scheduleId/events/': {
      id: '/projects/$projectId/schedules/$scheduleId/events/'
      path: '/projects/$projectId/schedules/$scheduleId/events'
      fullPath: '/projects/$projectId/schedules/$scheduleId/events'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesScheduleIdEventsIndexImport
      parentRoute: typeof rootRoute
    }
    '/projects/$projectId/schedules/$scheduleId/events/$eventId/': {
      id: '/projects/$projectId/schedules/$scheduleId/events/$eventId/'
      path: '/projects/$projectId/schedules/$scheduleId/events/$eventId'
      fullPath: '/projects/$projectId/schedules/$scheduleId/events/$eventId'
      preLoaderRoute: typeof ProjectsProjectIdSchedulesScheduleIdEventsEventIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  SettingsRouteRoute,
  SignInRoute,
  SignUpRoute,
  ProjectsNewRoute,
  ProjectsIndexRoute,
  ProjectsProjectIdEditRoute,
  ProjectsProjectIdIndexRoute,
  ProjectsProjectIdBoardsNewRoute,
  ProjectsProjectIdNotesNewRoute,
  ProjectsProjectIdSchedulesNewRoute,
  ProjectsProjectIdBoardsIndexRoute,
  ProjectsProjectIdNotesIndexRoute,
  ProjectsProjectIdSchedulesIndexRoute,
  ProjectsProjectIdBoardsBoardIdEditRoute,
  ProjectsProjectIdNotesNoteIdEditRoute,
  ProjectsProjectIdSchedulesScheduleIdEditRoute,
  ProjectsProjectIdBoardsBoardIdIndexRoute,
  ProjectsProjectIdNotesNoteIdIndexRoute,
  ProjectsProjectIdSchedulesScheduleIdIndexRoute,
  ProjectsProjectIdSchedulesScheduleIdEventsNewRoute,
  ProjectsProjectIdSchedulesScheduleIdEventsIndexRoute,
  ProjectsProjectIdSchedulesScheduleIdEventsEventIdIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/settings",
        "/sign-in",
        "/sign-up",
        "/projects/new",
        "/projects/",
        "/projects/$projectId/edit",
        "/projects/$projectId/",
        "/projects/$projectId/boards/new",
        "/projects/$projectId/notes/new",
        "/projects/$projectId/schedules/new",
        "/projects/$projectId/boards/",
        "/projects/$projectId/notes/",
        "/projects/$projectId/schedules/",
        "/projects/$projectId/boards/$boardId/edit",
        "/projects/$projectId/notes/$noteId/edit",
        "/projects/$projectId/schedules/$scheduleId/edit",
        "/projects/$projectId/boards/$boardId/",
        "/projects/$projectId/notes/$noteId/",
        "/projects/$projectId/schedules/$scheduleId/",
        "/projects/$projectId/schedules/$scheduleId/events/new",
        "/projects/$projectId/schedules/$scheduleId/events/",
        "/projects/$projectId/schedules/$scheduleId/events/$eventId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/settings": {
      "filePath": "settings/route.tsx"
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/sign-up": {
      "filePath": "sign-up.tsx"
    },
    "/projects/new": {
      "filePath": "projects/new.tsx"
    },
    "/projects/": {
      "filePath": "projects/index.tsx"
    },
    "/projects/$projectId/edit": {
      "filePath": "projects/$projectId/edit.tsx"
    },
    "/projects/$projectId/": {
      "filePath": "projects/$projectId/index.tsx"
    },
    "/projects/$projectId/boards/new": {
      "filePath": "projects/$projectId/boards/new.tsx"
    },
    "/projects/$projectId/notes/new": {
      "filePath": "projects/$projectId/notes/new.tsx"
    },
    "/projects/$projectId/schedules/new": {
      "filePath": "projects/$projectId/schedules/new.tsx"
    },
    "/projects/$projectId/boards/": {
      "filePath": "projects/$projectId/boards/index.tsx"
    },
    "/projects/$projectId/notes/": {
      "filePath": "projects/$projectId/notes/index.tsx"
    },
    "/projects/$projectId/schedules/": {
      "filePath": "projects/$projectId/schedules/index.tsx"
    },
    "/projects/$projectId/boards/$boardId/edit": {
      "filePath": "projects/$projectId/boards/$boardId/edit.tsx"
    },
    "/projects/$projectId/notes/$noteId/edit": {
      "filePath": "projects/$projectId/notes/$noteId/edit.tsx"
    },
    "/projects/$projectId/schedules/$scheduleId/edit": {
      "filePath": "projects/$projectId/schedules/$scheduleId/edit.tsx"
    },
    "/projects/$projectId/boards/$boardId/": {
      "filePath": "projects/$projectId/boards/$boardId/index.tsx"
    },
    "/projects/$projectId/notes/$noteId/": {
      "filePath": "projects/$projectId/notes/$noteId/index.tsx"
    },
    "/projects/$projectId/schedules/$scheduleId/": {
      "filePath": "projects/$projectId/schedules/$scheduleId/index.tsx"
    },
    "/projects/$projectId/schedules/$scheduleId/events/new": {
      "filePath": "projects/$projectId/schedules/$scheduleId/events/new.tsx"
    },
    "/projects/$projectId/schedules/$scheduleId/events/": {
      "filePath": "projects/$projectId/schedules/$scheduleId/events/index.tsx"
    },
    "/projects/$projectId/schedules/$scheduleId/events/$eventId/": {
      "filePath": "projects/$projectId/schedules/$scheduleId/events/$eventId/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
