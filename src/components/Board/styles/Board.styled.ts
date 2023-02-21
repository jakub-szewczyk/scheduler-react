import { Box, styled } from '@mui/material'

const BoardContainer = styled(Box)<{ scroll: -1 | 0 | 1 }>(
  ({ theme, scroll }) => ({
    display: 'flex',
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    margin: '5rem auto 0 auto',
    overflowX: 'auto',
    overflowY: 'hidden',
    '&::-webkit-scrollbar': {
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
    '::-webkit-scrollbar-button:single-button': {
      width: 0,
      background: theme.palette.secondary.light,
    },
    '&::-webkit-scrollbar-button:single-button:decrement': {
      width: scroll === -1 ? 8 : 0,
      visibility: scroll === -1 ? 'hidden' : 'visible',
    },
    '&::-webkit-scrollbar-button:single-button:increment': {
      width: scroll === 1 ? 8 : 0,
      visibility: scroll === 1 ? 'hidden' : 'visible',
    },
  })
)

export { BoardContainer }
