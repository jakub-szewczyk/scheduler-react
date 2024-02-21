import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { ListItem, Typography } from '@mui/material'

const DrawerEmptyItem = () => (
  <ListItem
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 0.5,
    }}
  >
    <Typography>No items found</Typography>
    <SentimentVeryDissatisfiedIcon fontSize='small' />
  </ListItem>
)

export default DrawerEmptyItem
