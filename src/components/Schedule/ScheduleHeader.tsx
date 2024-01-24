import { updateSchedule } from '@/services/schedule'
import { InitialValues, Schedule } from '@/types/schedule'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useParams } from 'react-router-dom'
import { useBoolean } from 'usehooks-ts'
import UpsertScheduleDialog from './UpsertScheduleDialog'

type Params = {
  projectId: string
  scheduleId: string
}

interface ScheduleHeaderProps {
  schedule: Schedule
}

const ScheduleHeader = ({ schedule }: ScheduleHeaderProps) => {
  const {
    value: isEditScheduleDialogOpen,
    setFalse: closeEditScheduleDialog,
    setTrue: openEditScheduleDialog,
  } = useBoolean()

  const params = useParams<Params>()

  const queryClient = useQueryClient()

  const { mutate: updateScheduleMutation, isLoading: isScheduleUpdating } =
    useMutation(updateSchedule, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries([
            'projects',
            params.projectId,
            'schedules',
          ]),
          queryClient.invalidateQueries([
            'infinite',
            'projects',
            params.projectId,
            'schedules',
          ]),
        ])
        closeEditScheduleDialog()
      },
    })

  const handleScheduleEdit = (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) =>
    updateScheduleMutation(
      {
        projectId: params.projectId!,
        scheduleId: schedule.id,
        name: values.name,
      },
      { onSettled: () => setSubmitting(false) }
    )

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
        mode='update'
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
