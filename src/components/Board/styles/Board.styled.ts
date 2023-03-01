import { Box, styled } from '@mui/material'

const BoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: 'calc(100% - 32px)',
  maxWidth: theme.breakpoints.values.lg,
  margin: '3.5rem auto 0 auto',
  overflowX: 'auto',
  overflowY: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 48px)',
    marginTop: '4rem',
  },
  '::-webkit-scrollbar': {
    height: 8,
  },
  '::-webkit-scrollbar-track': {
    background: theme.palette.secondary.light,
    borderRadius: theme.shape.borderRadius,
  },
  '::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}))

export { BoardContainer }
