import { createBrowserRouter, Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Kanban from './pages/Kanban/Kanban'
import Notes from './pages/Notes/Notes'
import { Schedule } from './types/schedule'

const createRouter = (schedule: Schedule) =>
  createBrowserRouter([
    {
      element: (
        <>
          <Navbar schedule={schedule} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: '/',
          element: <Dashboard />,
        },
        {
          path: '/notes',
          element: <Notes />,
        },
        {
          path: '/kanban',
          element: <Kanban />,
        },
      ],
    },
  ])

export default createRouter
