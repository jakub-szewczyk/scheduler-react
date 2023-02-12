import { Box, styled } from '@mui/material'

const BoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '5rem auto 0 auto',
  overflowX: 'auto',
  overflowY: 'hidden',
}))

export { BoardContainer }
