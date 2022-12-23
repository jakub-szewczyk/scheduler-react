import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import SaveIcon from '@mui/icons-material/Save'
import ViewListIcon from '@mui/icons-material/ViewList'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { flow, pipe } from 'fp-ts/lib/function'
import { cond, either, equals, map, path, trim } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useBoolean } from 'usehooks-ts'
import * as SCHEDULE from '../../modules/schedule'
import { Schedule } from '../../types/schedule'
import SaveScheduleDialog from './SaveScheduleDialog'
import SchedulesDrawer from './SchedulesDrawer'

interface ScheduleActionsProps {
  schedule: Schedule
  schedules: Schedule[]
  setSchedules: Dispatch<SetStateAction<Schedule[]>>
}

const ScheduleActions = ({
  schedule,
  schedules,
  setSchedules,
}: ScheduleActionsProps) => {
  const {
    value: isSchedulesDrawerOpen,
    setFalse: closeSchedulesDrawer,
    setTrue: openSchedulesDrawer,
  } = useBoolean()

  const {
    value: isSaveScheduleDialogOpen,
    setFalse: closeSaveScheduleDialog,
    setTrue: openSaveScheduleDialog,
  } = useBoolean()

  const handleSpeedDialActionClick = flow(
    path(['currentTarget', 'ariaLabel']) as () => string,
    cond([
      [equals('Download'), SCHEDULE.exportToXLSX(schedule)],
      [equals('Print'), window.print],
      [either(equals('Save'), equals('Rename')), openSaveScheduleDialog],
      [equals('Schedules'), openSchedulesDrawer],
    ])
  )

  const handleScheduleSave = ({ name }: { name: string }) => {
    setSchedules(pipe(name, trim, SCHEDULE.save))
    closeSaveScheduleDialog()
  }

  const handleScheduleCreate = () => {
    setSchedules(SCHEDULE.add)
    closeSchedulesDrawer()
  }

  const handleScheduleDelete = (name: string) => {
    setSchedules(SCHEDULE.remove(name))
    closeSchedulesDrawer()
  }

  const handleScheduleSelect = (name: string) => {
    setSchedules(SCHEDULE.select(name))
    closeSchedulesDrawer()
  }

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        {map(
          ({ name, icon }) => (
            <SpeedDialAction
              key={name}
              icon={icon}
              tooltipTitle={name}
              onClick={handleSpeedDialActionClick}
            />
          ),
          [
            { name: 'Download', icon: <DownloadIcon /> },
            { name: 'Print', icon: <PrintIcon /> },
            {
              name: SCHEDULE.isUnsaved(schedule) ? 'Save' : 'Rename',
              icon: SCHEDULE.isUnsaved(schedule) ? <SaveIcon /> : <EditIcon />,
            },
            { name: 'Schedules', icon: <ViewListIcon /> },
          ]
        )}
      </SpeedDial>
      <SchedulesDrawer
        open={isSchedulesDrawerOpen}
        onClose={closeSchedulesDrawer}
        schedule={schedule}
        schedules={schedules}
        onCreate={handleScheduleCreate}
        onDelete={handleScheduleDelete}
        onSelect={handleScheduleSelect}
      />
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

export default ScheduleActions
