import { UserButton } from '@clerk/clerk-react'
import ThemeSelect from '../ThemeSelect/ThemeSelect'

const Navbar = () => (
  <header className='z-10 inset-x-0 fixed flex items-center justify-end gap-x-4 h-12 px-3 border-b bg-background sm:px-6'>
    <ThemeSelect />
    <UserButton />
  </header>
)

export default Navbar
