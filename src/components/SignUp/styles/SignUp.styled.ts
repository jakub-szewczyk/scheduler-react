import { Box, styled } from '@mui/material'

export const SignUpContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 64px)',
  marginTop: '-1rem',
  [theme.breakpoints.up('sm')]: {
    marginTop: '-1.5rem',
  },
}))
