import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Navbar from './layout/Navbar/Navbar'
import Schedules from './pages/Schedules/Schedules'
import Boards from './pages/Boards/Boards'
import Notes from './pages/Notes/Notes'

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
        element: <Navigate to='/schedules' replace />,
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
