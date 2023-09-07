import { exportToXLSX } from '@/modules/schedule'
import { createSchedule, updateSchedule } from '@/services/schedule'
import { InitialValues, Schedule } from '@/types/schedule'
import { useAuth } from '@clerk/clerk-react'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import ViewListIcon from '@mui/icons-material/ViewList'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useBoolean, useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import UpsertScheduleDialog from '../Schedule/UpsertScheduleDialog'
import SchedulesDrawer from './SchedulesDrawer'

interface ScheduleActionsProps {
  schedule: Schedule
}

const ScheduleActions = ({ schedule }: ScheduleActionsProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const [, setSelectedScheduleId] = useLocalStorage<string | null>(
    'selectedScheduleId',
    null
  )

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

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: createScheduleMutation, isLoading: isScheduleCreating } =
    useMutation(createSchedule, {
      onSuccess: ({ id }) => {
        queryClient.invalidateQueries(
          ['projects', selectedProjectId, 'schedules'],
          { exact: true }
        )
        setSelectedScheduleId(id)
        closeCreateScheduleDialog()
      },
    })

  const { mutate: updateScheduleMutation, isLoading: isScheduleUpdating } =
    useMutation(updateSchedule, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'projects',
          selectedProjectId,
          'schedules',
        ])
        closeEditScheduleDialog()
      },
    })

  const handleScheduleSelect = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId)
    closeSchedulesDrawer()
  }

  const handleScheduleCreate = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) =>
    createScheduleMutation({
      projectId: selectedProjectId!,
      name: values.name,
      token: await getToken(),
    })

  const handleScheduleEdit = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) =>
    updateScheduleMutation({
      projectId: selectedProjectId!,
      scheduleId: schedule.id,
      name: values.name,
      token: await getToken(),
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
          icon={<ViewListIcon />}
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
