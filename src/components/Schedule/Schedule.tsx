import DataChangeBar from '@/layout/DataChangeBar/DataChangeBar'
import { getAllProjects } from '@/services/project'
import { getAllSchedules, getSchedule } from '@/services/schedule'
import { Row } from '@/types/row'
import { useAuth } from '@clerk/clerk-react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { equals } from 'ramda'
import { useImmer } from 'use-immer'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import * as TABLE from '../../modules/table'
import { ProjectContainer } from '../Project/styles/Project.styles'
import ScheduleHeader from './ScheduleHeader'
import createColumns from './helpers/createColumns'
import { DataGrid, DataGridContainer } from './styles/DataGrid.styled'

const Schedule = () => {
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
        onSuccess: (schedules) => {
          if (
            selectedScheduleId &&
            schedules.map((project) => project.id).includes(selectedScheduleId)
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
    [selectedProjectId, 'schedules', selectedScheduleId],
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

  if (isScheduleFetchedWithError)
    return (
      <ProjectContainer>
        <Typography color='error'>
          Something went wrong. Please try again.
        </Typography>
      </ProjectContainer>
    )

  const columns = createColumns(setRows)

  return (
    <>
      <ScheduleHeader schedule={schedule} />
      <DataGridContainer
        elevation={0}
        height={TABLE.calculateHeight(rows)}
        sx={{
          maxWidth: (theme) =>
            Math.min(
              theme.breakpoints.values.lg,
              TABLE.calculateMaxWidth(columns)
            ),
        }}
      >
        <DataGrid
          disableColumnMenu
          hideFooterPagination
          headerHeight={TABLE.HEADER_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          columns={columns}
          rows={rows}
          onCellEditCommit={({ field, value, id }) =>
            setRows((rows) => {
              const row = rows.find((row) => row.id === id)!
              row[field as keyof Row] = value
            })
          }
        />
      </DataGridContainer>
      {!equals(rows, schedule.rows) && (
        <DataChangeBar
          onDiscard={() => setRows(schedule.rows)}
          onSave={alert}
        />
      )}
    </>
  )
}

export default Schedule
