import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { getSchedule, getSchedules } from '@/services/schedule'
import { Row } from '@/types/row'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useImmer } from 'use-immer'
import Schedule from '../../components/Schedule/Schedule'
import ScheduleActions from '../../components/ScheduleActions/ScheduleActions'

type Params = {
  projectId: string
  scheduleId: string
}

const Schedules = () => {
  const [rows, setRows] = useImmer<Row[]>([])

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  useQuery(
    ['projects', params.projectId, 'schedules'],
    () => getSchedules({ projectId: params.projectId! }),
    {
      enabled: !params.scheduleId,
      onSuccess: (schedules) =>
        !params.scheduleId &&
        navigate(
          `/projects/${params.projectId}/schedules/${schedules[0].id
          }?${searchParams.toString()}`,
          { replace: true }
        ),
    }
  )

  const {
    data: schedule,
    isLoading: isScheduleLoading,
    isError: isScheduleFetchedUnsuccessfully,
  } = useQuery(
    ['projects', params.projectId, 'schedules', params.scheduleId],
    async () =>
      getSchedule({
        projectId: params.projectId!,
        scheduleId: params.scheduleId!,
      }),
    {
      enabled: !!params.scheduleId,
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

  /**
   * TODO:
   * Improve error display.
   */
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
