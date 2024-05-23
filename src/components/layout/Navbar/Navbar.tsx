import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'

const Navbar = () => (
  <header className='flex justify-end gap-x-2 h-12 px-3 border-b'>
    <SignedIn>
      <UserButton />
    </SignedIn>
    <SignedOut>
      <Link to='/sign-in'>Sign in</Link>
    </SignedOut>
    <SignedOut>
      <Link to='/sign-up'>Sign up</Link>
    </SignedOut>
  </header>
)

export default Navbar
