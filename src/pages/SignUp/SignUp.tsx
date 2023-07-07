import { SignUpContainer } from '@/components/SignUp/styles/SignUp.styled'
import { SignUp as ClerkSignUp } from '@clerk/clerk-react'

const SignUp = () => (
  <SignUpContainer>
    <ClerkSignUp />
  </SignUpContainer>
)

export default SignUp
