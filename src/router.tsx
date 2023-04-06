import { createBrowserRouter, Outlet } from 'react-router-dom'
import Navbar from './layout/Navbar/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Kanban from './pages/Kanban/Kanban'
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

export default router
