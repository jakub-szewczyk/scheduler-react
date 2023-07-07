import { SignInContainer } from '@/components/SignIn/styles/SignIn.styled'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'

const SignIn = () => (
  <SignInContainer>
    <ClerkSignIn />
  </SignInContainer>
)

export default SignIn
