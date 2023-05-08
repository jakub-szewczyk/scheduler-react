import { Box, styled } from '@mui/material'

export const BoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: 'calc(100% - 32px)',
  maxWidth: theme.breakpoints.values.lg,
  margin: '1rem auto',
  overflowX: 'auto',
  overflowY: 'hidden',
  '::-webkit-scrollbar': {
    height: 4,
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
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 48px)',
    marginBlock: '1.5rem',
    '::-webkit-scrollbar': {
      height: 8,
    },
  },
}))
