import { getAllProjects } from '@/services/project'
import { getAllSchedules } from '@/services/schedule'
import { useAuth } from '@clerk/clerk-react'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { useQuery } from '@tanstack/react-query'
import { MouseEventHandler } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'
import SchedulesDrawerItem from './SchedulesDrawerItem'
import SchedulesDrawerItemSkeleton from './SchedulesDrawerItemSkeleton'

interface SchedulesDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onDelete: (name: string) => void
  onSelect: (name: string) => void
}

const SchedulesDrawer = ({
  onCreate,
  onDelete,
  onSelect,
  ...props
}: SchedulesDrawerProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const { getToken } = useAuth()

  const { data: projects, isSuccess: isEachProjectFetchedSuccessfully } =
    useQuery(['projects'], async () => getAllProjects(await getToken()))

  const {
    data: schedules,
    isLoading,
    isSuccess,
  } = useQuery(
    [selectedProjectId, 'schedules'],
    async () =>
      getAllSchedules({
        projectId: selectedProjectId!,
        token: await getToken(),
      }),
    {
      enabled:
        !!selectedProjectId &&
        isEachProjectFetchedSuccessfully &&
        projects.map((project) => project.id).includes(selectedProjectId),
    }
  )

  return (
    <SwipeableDrawer
      {...props}
      anchor='right'
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Stack
        padding={2}
        justifyContent='space-between'
        height='100%'
        rowGap={2}
      >
        <Stack spacing={2} overflow='auto'>
          <Typography variant='h6' align='center'>
            Create or load schedules
          </Typography>
          <List
            sx={{
              overflow: 'auto',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
            }}
          >
            {isLoading &&
              Array(3)
                .fill(null)
                .map((_, index) => <SchedulesDrawerItemSkeleton key={index} />)}
            {isSuccess &&
              schedules.map((schedule) => (
                <SchedulesDrawerItem
                  key={schedule.name}
                  schedule={schedule}
                  schedules={schedules}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
          </List>
        </Stack>
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            onClick={onCreate}
            fullWidth
          >
            New schedule
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  )
}

export default SchedulesDrawer
