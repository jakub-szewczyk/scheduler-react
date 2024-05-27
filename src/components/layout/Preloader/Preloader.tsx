import { LoaderCircle } from 'lucide-react'

const Preloader = () => (
  <div className='flex items-center justify-center w-screen h-screen'>
    <LoaderCircle className='animate-spin' />
  </div>
)

export default Preloader
