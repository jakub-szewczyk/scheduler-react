import { updateSchedule } from '@/services/schedule'
import { InitialValues, Schedule } from '@/types/schedule'
import { useAuth } from '@clerk/clerk-react'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useBoolean, useReadLocalStorage } from 'usehooks-ts'
import UpsertScheduleDialog from './UpsertScheduleDialog'

interface ScheduleHeaderProps {
  schedule: Schedule
}

const ScheduleHeader = ({ schedule }: ScheduleHeaderProps) => {
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const {
    value: isEditScheduleDialogOpen,
    setFalse: closeEditScheduleDialog,
    setTrue: openEditScheduleDialog,
  } = useBoolean()

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const { mutate: updateScheduleMutation, isLoading: isScheduleUpdating } =
    useMutation(updateSchedule, {
      onSuccess: ({ id }) => {
        queryClient.invalidateQueries([
          'projects',
          selectedProjectId,
          'schedules',
          id,
        ])
        closeEditScheduleDialog()
      },
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
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        columnGap={1.5}
        width={{
          xs: 'calc(100% - 32px)',
          sm: 'calc(100% - 48px)',
        }}
        maxWidth={(theme) => theme.breakpoints.values.lg}
        marginX='auto'
      >
        <IconButton size='small' onClick={openEditScheduleDialog}>
          <EditIcon fontSize='small' />
        </IconButton>
        <Typography maxWidth={(theme) => theme.breakpoints.values.sm} noWrap>
          {schedule.name}
        </Typography>
      </Stack>
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

export default ScheduleHeader
