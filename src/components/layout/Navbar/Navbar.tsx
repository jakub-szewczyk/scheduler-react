import { UserButton } from '@clerk/clerk-react'

const Navbar = () => (
  <header className='flex items-center justify-end gap-x-2 h-12 px-3 border-b sm:px-6'>
    <UserButton />
  </header>
)

export default Navbar
