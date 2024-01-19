import { exportToXLSX } from '@/modules/schedule'
import { createSchedule, updateSchedule } from '@/services/schedule'
import { InitialValues, Schedule } from '@/types/schedule'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import PrintIcon from '@mui/icons-material/Print'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import UpsertScheduleDialog from '../Schedule/UpsertScheduleDialog'
import SchedulesDrawer from './SchedulesDrawer'

type Params = {
  projectId: string
  scheduleId: string
}

interface ScheduleActionsProps {
  schedule: Schedule
}

const ScheduleActions = ({ schedule }: ScheduleActionsProps) => {
  const {
    value: isSchedulesDrawerOpen,
    setFalse: closeSchedulesDrawer,
    setTrue: openSchedulesDrawer,
  } = useBoolean()

  const {
    value: isCreateScheduleDialogOpen,
    setFalse: closeCreateScheduleDialog,
    setTrue: openCreateScheduleDialog,
  } = useBoolean()

  const {
    value: isEditScheduleDialogOpen,
    setFalse: closeEditScheduleDialog,
    setTrue: openEditScheduleDialog,
  } = useBoolean()

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: createScheduleMutation, isLoading: isScheduleCreating } =
    useMutation(createSchedule, {
      onSuccess: async (schedule) => {
        await queryClient.invalidateQueries(
          ['projects', params.projectId, 'schedules'],
          { exact: true }
        )
        navigate({
          pathname: `/projects/${params.projectId}/schedules/${schedule.id}`,
          search: searchParams.toString(),
        })
        closeCreateScheduleDialog()
      },
    })

  const { mutate: updateScheduleMutation, isLoading: isScheduleUpdating } =
    useMutation(updateSchedule, {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'projects',
          params.projectId,
          'schedules',
        ])
        closeEditScheduleDialog()
      },
    })

  const handleScheduleSelect = (scheduleId: string) => {
    navigate({
      pathname: `/projects/${params.projectId}/schedules/${scheduleId}`,
      search: searchParams.toString(),
    })
    closeSchedulesDrawer()
  }

  const handleScheduleCreate = (
    values: InitialValues,
    _: FormikHelpers<InitialValues>
  ) =>
    createScheduleMutation({
      projectId: params.projectId!,
      name: values.name,
    })

  const handleScheduleEdit = (
    values: InitialValues,
    _: FormikHelpers<InitialValues>
  ) =>
    updateScheduleMutation({
      projectId: params.projectId!,
      scheduleId: schedule.id,
      name: values.name,
    })

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <SpeedDialAction
          tooltipTitle='Download'
          icon={<DownloadIcon />}
          onClick={exportToXLSX(schedule)}
        />
        <SpeedDialAction
          tooltipTitle='Print'
          icon={<PrintIcon />}
          onClick={window.print}
        />
        <SpeedDialAction
          tooltipTitle='Rename'
          icon={<EditIcon />}
          onClick={openEditScheduleDialog}
        />
        <SpeedDialAction
          tooltipTitle='Schedules'
          icon={<PendingActionsIcon />}
          onClick={openSchedulesDrawer}
        />
      </SpeedDial>
      <SchedulesDrawer
        open={isSchedulesDrawerOpen}
        onOpen={openSchedulesDrawer}
        onClose={closeSchedulesDrawer}
        onSelect={handleScheduleSelect}
        onCreate={openCreateScheduleDialog}
      />
      <UpsertScheduleDialog
        mode='CREATE'
        open={isCreateScheduleDialogOpen}
        onClose={closeCreateScheduleDialog}
        schedule={schedule}
        loading={isScheduleCreating}
        onCreate={handleScheduleCreate}
      />
      <UpsertScheduleDialog
        mode='EDIT'
        open={isEditScheduleDialogOpen}
        onClose={closeEditScheduleDialog}
        schedule={schedule}
        loading={isScheduleUpdating}
        onEdit={handleScheduleEdit}
      />
    </>
  )
}

export default ScheduleActions
