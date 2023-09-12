import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
} from '@mui/material'

const DrawerItemSkeleton = () => (
  <Stack direction='row' alignItems='start'>
    <ListItemButton>
      <ListItemAvatar>
        <Skeleton variant='circular' width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant='text' />}
        secondary={<Skeleton variant='text' sx={{ fontSize: 14 }} />}
      />
    </ListItemButton>
    <Box>
      <IconButton size='small' disabled>
        <CloseIcon fontSize='small' />
      </IconButton>
    </Box>
  </Stack>
)

export default DrawerItemSkeleton