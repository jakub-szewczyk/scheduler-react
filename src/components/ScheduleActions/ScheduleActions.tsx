import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import SaveIcon from '@mui/icons-material/Save'
import ViewListIcon from '@mui/icons-material/ViewList'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { flow } from 'fp-ts/lib/function'
import { cond, either, equals, map, path } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useBoolean } from 'usehooks-ts'
import { Schedule } from '../Schedule/types/Schedule.types'
import addSchedule from './functions/addSchedule'
import isUnsavedSchedule from './functions/isUnsavedSchedule'
import removeSchedule from './functions/removeSchedule'
import saveSchedule from './functions/saveSchedule'
import SaveDialog from './SaveDialog'
import SavesDrawer from './SavesDrawer'
import { SaveSchedule } from './types/ScheduleActions.types'

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
    value: isDrawerOpen,
    setFalse: closeDrawer,
    setTrue: openDrawer,
  } = useBoolean()

  const {
    value: isSaveDialogOpen,
    setFalse: closeSaveDialog,
    setTrue: openSaveDialog,
  } = useBoolean()

  const handleSpeedDialActionClick = flow(
    path(['currentTarget', 'ariaLabel']) as () => string,
    cond([
      [either(equals('Save'), equals('Rename')), openSaveDialog],
      [equals('Schedules'), openDrawer],
    ])
  )

  const handleSave = ({ name }: SaveSchedule) => {
    setSchedules(saveSchedule(name))
    closeSaveDialog()
  }

  const handleCreate = () => {
    setSchedules(addSchedule)
    closeDrawer()
  }

  const handleDelete = (name: string) => {
    setSchedules(removeSchedule(name))
    closeDrawer()
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
              name: isUnsavedSchedule(schedule) ? 'Save' : 'Rename',
              icon: isUnsavedSchedule(schedule) ? <SaveIcon /> : <EditIcon />,
            },
            { name: 'Schedules', icon: <ViewListIcon /> },
          ]
        )}
      </SpeedDial>
      <SavesDrawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        schedule={schedule}
        schedules={schedules}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
      <SaveDialog
        open={isSaveDialogOpen}
        onClose={closeSaveDialog}
        schedule={schedule}
        onSave={handleSave}
      />
    </>
  )
}

export default ScheduleActions
