import { Box, Paper, styled } from '@mui/material'

const NoteContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 32px)',
  maxWidth: theme.breakpoints.values.lg,
  margin: '1rem auto',
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 48px)',
    marginBlock: '1.5rem',
  },
}))

const ToolbarContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  columnGap: 16,
  padding: 16,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflowX: 'auto',
  '::-webkit-scrollbar': {
    width: 4,
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
  '::-webkit-scrollbar-corner': {
    display: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
  },
}))

const EditorContainer = styled(Paper)(({ theme }) => ({
  minHeight: 'calc(100vh - 157px)',
  maxHeight: 'calc(100vh - 157px)',
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
    minHeight: 'calc(100vh - 181px)',
    maxHeight: 'calc(100vh - 181px)',
    '::-webkit-scrollbar': {
      width: 8,
    },
  },
}))

export { NoteContainer, ToolbarContainer, EditorContainer }
