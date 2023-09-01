import { InitialValues, Schedule } from '@/types/schedule'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useBoolean } from 'usehooks-ts'
import UpsertScheduleDialog from './UpsertScheduleDialog'
import { FormikHelpers } from 'formik'

interface ScheduleHeaderProps {
  schedule: Schedule
}

const ScheduleHeader = ({ schedule }: ScheduleHeaderProps) => {
  const {
    value: isEditScheduleDialogOpen,
    setFalse: closeEditScheduleDialog,
    setTrue: openEditScheduleDialog,
  } = useBoolean()

  const handleScheduleEdit = (
    values: InitialValues,
    formikHelpers: FormikHelpers<InitialValues>
  ) => {
    // TODO: Handle updating schedule's name
    console.log('values', values)
    closeEditScheduleDialog()
  }

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
        loading={false}
        onEdit={handleScheduleEdit}
      />
    </>
  )
}

export default ScheduleHeader
