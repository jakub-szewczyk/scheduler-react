import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { getAllProjects } from '@/services/project'
import { getAllSchedules, getSchedule } from '@/services/schedule'
import { Row } from '@/types/row'
import { useAuth } from '@clerk/clerk-react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useImmer } from 'use-immer'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import Schedule from '../../components/Schedule/Schedule'
import ScheduleActions from '../../components/ScheduleActions/ScheduleActions'

const Schedules = () => {
  const [rows, setRows] = useImmer<Row[]>([])

  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const [selectedScheduleId, setSelectedScheduleId] = useLocalStorage<
    string | null
  >('selectedScheduleId', null)

  const { getToken } = useAuth()

  const { data: projects, isSuccess: isEachProjectFetchedSuccessfully } =
    useQuery(['projects'], async () => getAllProjects(await getToken()))

  const { data: schedules, isSuccess: isEachScheduleFetchedSuccessfully } =
    useQuery(
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
        onSuccess: (schedules) => {
          if (
            selectedScheduleId &&
            schedules
              .map((schedule) => schedule.id)
              .includes(selectedScheduleId)
          )
            return
          setSelectedScheduleId(schedules[0].id)
        },
      }
    )

  const {
    data: schedule,
    isLoading: isScheduleLoading,
    isError: isScheduleFetchedWithError,
  } = useQuery(
    ['projects', selectedProjectId, 'schedules', selectedScheduleId],
    async () =>
      getSchedule({
        projectId: selectedProjectId!,
        scheduleId: selectedScheduleId!,
        token: await getToken(),
      }),
    {
      enabled:
        !!selectedScheduleId &&
        isEachScheduleFetchedSuccessfully &&
        schedules.map((schedule) => schedule.id).includes(selectedScheduleId),
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

  if (isScheduleFetchedWithError)
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
