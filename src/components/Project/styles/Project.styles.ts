import { Paper, styled } from '@mui/material'

const ProjectContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  gap: 6,
  width: 'calc(100% - 32px)',
  minHeight: 'calc(100vh - 88px)',
  padding: 6,
  margin: '1rem auto',
  [theme.breakpoints.up('sm')]: {
    width: 'calc(100% - 48px)',
    minHeight: 'calc(100vh - 112px)',
    marginBlock: '1.5rem',
  },
}))

export { ProjectContainer }
