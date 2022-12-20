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
import * as SCHEDULE from '../../modules/schedule'
import { Schedule } from '../../types/schedule'
import SaveDialog from './SaveDialog'
import SavesDrawer from './SavesDrawer'

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

  const handleSave = ({ name }: { name: string }) => {
    setSchedules(SCHEDULE.save(name))
    closeSaveDialog()
  }

  const handleCreate = () => {
    setSchedules(SCHEDULE.add)
    closeDrawer()
  }

  const handleDelete = (name: string) => {
    setSchedules(SCHEDULE.remove(name))
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
              name: SCHEDULE.isUnsaved(schedule) ? 'Save' : 'Rename',
              icon: SCHEDULE.isUnsaved(schedule) ? <SaveIcon /> : <EditIcon />,
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
