import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { pipe } from 'fp-ts/lib/function'
import { trim } from 'ramda'
import { useBoolean } from 'usehooks-ts'
import useSchedules from '../../hooks/useSchedules'
import * as SCHEDULE from '../../modules/schedule'
import SaveScheduleDialog from '../ScheduleActions/SaveScheduleDialog'
import { asteriskSuffix } from '../../modules/common'

const DataGridFooter = () => {
  const { schedule, schedules, setSchedules } = useSchedules()

  const {
    value: isSaveScheduleDialogOpen,
    setFalse: closeSaveScheduleDialog,
    setTrue: openSaveScheduleDialog,
  } = useBoolean()

  const handleScheduleSave = ({ name }: { name: string }) => {
    setSchedules(pipe(name, trim, SCHEDULE.save))
    closeSaveScheduleDialog()
  }

  return (
    <>
      <Stack direction='row' height={60} paddingX={2}>
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          columnGap={1.5}
          width='100%'
        >
          <IconButton size='small' onClick={openSaveScheduleDialog}>
            <EditIcon fontSize='small' />
          </IconButton>
          <Typography maxWidth='calc(100% - 42px)' noWrap>
            {asteriskSuffix(schedule.name)}
          </Typography>
        </Stack>
      </Stack>
      <SaveScheduleDialog
        open={isSaveScheduleDialogOpen}
        onClose={closeSaveScheduleDialog}
        schedule={schedule}
        schedules={schedules}
        onSave={handleScheduleSave}
      />
    </>
  )
}

export default DataGridFooter
