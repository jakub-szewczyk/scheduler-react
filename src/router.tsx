import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Navbar from './layout/Navbar/Navbar'
import Boards from './pages/Boards/Boards'
import Notes from './pages/Notes/Notes'
import Projects from './pages/Projects/Projects'
import Schedules from './pages/Schedules/Schedules'

const router = createBrowserRouter([
  {
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/',
        element: <Projects />,
      },
      {
        path: '/notes',
        element: <Notes />,
      },
      {
        path: '/boards',
        element: <Boards />,
      },
      {
        path: '/schedules',
        element: <Schedules />,
      },
      {
        path: '*',
        element: <Navigate to='/schedules' replace />,
      },
    ],
  },
])

export default router
