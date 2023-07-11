import { SignUpContainer } from '@/components/SignUp/styles/SignUp.styled'
import { SignUp as ClerkSignUp, useClerk } from '@clerk/clerk-react'
import { CircularProgress } from '@mui/material'

const SignUp = () => {
  const { loaded } = useClerk()

  return (
    <SignUpContainer>
      {loaded ? <ClerkSignUp /> : <CircularProgress />}
    </SignUpContainer>
  )
}

export default SignUp
