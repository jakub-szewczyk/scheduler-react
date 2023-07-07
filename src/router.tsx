import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Navbar from './layout/Navbar/Navbar'
import Boards from './pages/Boards/Boards'
import Notes from './pages/Notes/Notes'
import Projects from './pages/Projects/Projects'
import Schedules from './pages/Schedules/Schedules'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'

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
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/',
        element: (
          <>
            <SignedIn>
              <Projects />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      {
        path: '/notes',
        element: (
          <>
            <SignedIn>
              <Notes />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      {
        path: '/boards',
        element: (
          <>
            <SignedIn>
              <Boards />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      {
        path: '/schedules',
        element: (
          <>
            <SignedIn>
              <Schedules />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
      {
        path: '*',
        element: <Navigate to='/schedules' replace />,
      },
    ],
  },
])

export default router
