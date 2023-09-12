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
import DrawerItemSkeleton from '../../layout/DrawerItemSkeleton/DrawerItemSkeleton'
import SchedulesDrawerItem from './SchedulesDrawerItem'

interface SchedulesDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onSelect: (scheduleId: string) => void
}

const SchedulesDrawer = ({
  onCreate,
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
    isLoading: isEachScheduleLoading,
    isSuccess: isEachScheduleFetchedSuccessfully,
  } = useQuery(
    ['projects', selectedProjectId, 'schedules'],
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
            Select & manage schedules
          </Typography>
          <List
            sx={{
              overflow: 'auto',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              '::-webkit-scrollbar': {
                width: {
                  xs: 4,
                  sm: 8,
                },
              },
              '::-webkit-scrollbar-track': {
                bgcolor: (theme) => theme.palette.secondary.light,
                borderRadius: (theme) => theme.shape.borderRadius,
              },
              '::-webkit-scrollbar-thumb': {
                bgcolor: (theme) => theme.palette.primary.main,
                borderRadius: (theme) => theme.shape.borderRadius,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.primary.dark,
                },
              },
            }}
          >
            {isEachScheduleLoading &&
              Array(3)
                .fill(null)
                .map((_, index) => <DrawerItemSkeleton key={index} />)}
            {isEachScheduleFetchedSuccessfully &&
              schedules.map((schedule) => (
                <SchedulesDrawerItem
                  key={schedule.name}
                  schedule={schedule}
                  schedules={schedules}
                  onSelect={onSelect}
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
