import { Box, Paper, styled } from '@mui/material'

const EditorContainer = styled(Paper)(({ theme }) => ({
  minHeight: 'calc(100vh - 149px)',
  maxHeight: 'calc(100vh - 149px)',
  padding: 16,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  overflowY: 'auto',
  cursor: 'text',
  '::-webkit-scrollbar': {
    width: 4,
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
  '::-webkit-scrollbar-corner': {
    display: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: 'calc(100vh - 173px)',
    maxHeight: 'calc(100vh - 173px)',
    '::-webkit-scrollbar': {
      width: 8,
    },
  },
}))

const NoteContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 32px)',
  maxWidth: theme.breakpoints.values.lg,
  margin: '1rem auto',
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 48px)',
    marginBlock: '1.5rem',
  },
}))

export { EditorContainer, NoteContainer }
