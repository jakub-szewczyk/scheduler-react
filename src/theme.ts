import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0fbd92',
    },
    secondary: {
      main: '#1f2647',
    },
    background: {
      default: '#1f2647',
      paper: 'rgb(21, 26, 49)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
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
          [theme.breakpoints.up('sm')]: {
            '::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
          },
        },
      }),
    },
  },
})

export default theme
