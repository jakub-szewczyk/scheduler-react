import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { getSchedule, getSchedules } from '@/services/schedule'
import { Project } from '@/types/project'
import { Row } from '@/types/row'
import { Schedule as ISchedule } from '@/types/schedule'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useImmer } from 'use-immer'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import Schedule from '../../components/Schedule/Schedule'
import ScheduleActions from '../../components/ScheduleActions/ScheduleActions'
import { getProjects } from '@/services/project'
import { Navigate } from 'react-router-dom'

const Schedules = () => {
  const [rows, setRows] = useImmer<Row[]>([])

  const selectedProject = useReadLocalStorage<Pick<
    Project,
    'id' | 'name'
  > | null>('selectedProject')

  const [selectedSchedule, setSelectedSchedule] = useLocalStorage<Pick<
    ISchedule,
    'id' | 'name' | 'createdAt'
  > | null>('selectedSchedule', null)

  const { data: schedules } = useQuery(
    ['projects', selectedProject?.id, 'schedules'],
    () => getSchedules({ projectId: selectedProject!.id }),
    { enabled: !selectedSchedule }
  )

  const {
    data: schedule,
    isLoading: isScheduleLoading,
    isError: isScheduleFetchedUnsuccessfully,
  } = useQuery(
    ['projects', selectedProject?.id, 'schedules', selectedSchedule?.id],
    async () =>
      getSchedule({
        projectId: selectedProject!.id,
        scheduleId: selectedSchedule!.id,
      }),
    {
      enabled: !!selectedProject && !!selectedSchedule,
      // TODO: Simplify
      select: (schedule) => ({
        ...schedule,
        rows: schedule.rows.map((row) => ({
          ...row,
          ...(row.notification && {
            notification: {
              ...row.notification,
              title: row.notification?.title || '',
            },
          }),
        })),
      }),
      onSuccess: (schedule) => setRows(schedule.rows),
    }
  )

  if (!selectedProject) return <Navigate to='/' replace />

  /**
   * TODO:
   * Test loading and error states.
   */
  if (isScheduleLoading || rows.length === 0)
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    )

  if (isScheduleFetchedUnsuccessfully)
    return (
      <ProjectContainer>
        <Typography color='error'>
          Something went wrong. Please try again.
        </Typography>
      </ProjectContainer>
    )

  return (
    <>
      <Schedule schedule={schedule} rows={rows} setRows={setRows} />
      <ScheduleActions schedule={schedule} />
    </>
  )
}

export default Schedules
