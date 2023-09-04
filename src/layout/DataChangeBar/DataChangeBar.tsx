import PublishIcon from '@mui/icons-material/Publish'
import UndoIcon from '@mui/icons-material/Undo'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

interface DataChangeBarProps {
  loading?: boolean
  onDiscard: () => void
  onSave: () => void
}

const DataChangeBar = ({
  loading = false,
  onDiscard,
  onSave,
}: DataChangeBarProps) => {
  const theme = useTheme()

  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        height: {
          xs: 44,
          sm: 52,
        },
        bgcolor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Stack alignItems='center' justifyContent='center' height='100%'>
        <Stack direction='row' alignItems='center' columnGap={2}>
          {matches && <Typography>Save or discard changes?</Typography>}
          <Button
            size={matches ? 'medium' : 'small'}
            variant='outlined'
            disabled={loading}
            startIcon={<UndoIcon />}
            onClick={onDiscard}
          >
            Discard
          </Button>
          <LoadingButton
            size={matches ? 'medium' : 'small'}
            variant='outlined'
            loading={loading}
            endIcon={<PublishIcon />}
            onClick={onSave}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  )
}

export default DataChangeBar
