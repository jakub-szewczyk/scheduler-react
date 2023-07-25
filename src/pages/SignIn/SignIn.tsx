import { SignInContainer } from '@/components/SignIn/styles/SignIn.styled'
import { SignIn as ClerkSignIn, useClerk } from '@clerk/clerk-react'
import { Box, CircularProgress } from '@mui/material'

const SignIn = () => {
  const { loaded } = useClerk()

  return loaded ? (
    <SignInContainer>
      <ClerkSignIn />
    </SignInContainer>
  ) : (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default SignIn
