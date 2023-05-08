import { Grid2Props, styled } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

const ProjectContainer = styled((props: Grid2Props) => (
  <Grid {...props} container spacing={2} />
))(({ theme }) => ({
  alignContent: 'flex-start',
  width: 'calc(100% - 16px)',
  marginInline: 'auto',
  marginBottom: 8,
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 32px)',
    marginBottom: 16,
  },
}))

export { ProjectContainer }
