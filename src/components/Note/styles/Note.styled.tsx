import { Box, Paper, styled } from '@mui/material'

export const NoteContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 32px)',
  maxWidth: theme.breakpoints.values.lg,
  margin: '1rem auto',
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 48px)',
    marginBlock: '1.5rem',
  },
}))

export const ToolbarContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  columnGap: 16,
  height: 76,
  padding: 16,
  borderBottom: `thin solid ${theme.palette.divider}`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
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

export const EditorContainer = styled(Paper)(({ theme }) => ({
  minHeight: 'calc(100vh - 211px)',
  maxHeight: 'calc(100vh - 211px)',
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
    minHeight: 'calc(100vh - 243px)',
    maxHeight: 'calc(100vh - 243px)',
    '::-webkit-scrollbar': {
      width: 8,
    },
  },
  blockquote: {
    padding: '0.5rem 1rem',
    background: theme.palette.secondary.main,
    borderLeft: `0.25rem solid ${theme.palette.primary.main}`,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  '.public-DraftStyleDefault-pre': {
    padding: '0.5rem 1rem',
    background: theme.palette.secondary.main,
    borderRadius: 4,
    '& > pre': {
      marginBlock: 0,
    },
  },
}))
