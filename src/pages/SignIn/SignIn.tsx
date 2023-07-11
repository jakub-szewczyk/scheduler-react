import { SignInContainer } from '@/components/SignIn/styles/SignIn.styled'
import { SignIn as ClerkSignIn, useClerk } from '@clerk/clerk-react'
import { CircularProgress } from '@mui/material'

const SignIn = () => {
  const { loaded } = useClerk()

  return (
    <SignInContainer>
      {loaded ? <ClerkSignIn /> : <CircularProgress />}
    </SignInContainer>
  )
}

export default SignIn
