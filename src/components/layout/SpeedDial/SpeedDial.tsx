import DownloadIcon from '@mui/icons-material/Download'
import PrintIcon from '@mui/icons-material/Print'
import SaveIcon from '@mui/icons-material/Save'
import ViewListIcon from '@mui/icons-material/ViewList'
import { SpeedDial as MuiSpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { map } from 'ramda'

const actions = [
  { name: 'Download', icon: <DownloadIcon /> },
  { name: 'Print', icon: <PrintIcon /> },
  { name: 'Save', icon: <SaveIcon /> },
  { name: 'Schedules', icon: <ViewListIcon /> },
]

const SpeedDial = () => (
  <MuiSpeedDial
    ariaLabel='speed-dial'
    icon={<SpeedDialIcon />}
    sx={{ position: 'fixed', bottom: 24, right: 24 }}
  >
    {map(
      ({ name, icon }) => (
        <SpeedDialAction key={name} icon={icon} tooltipTitle={name} />
      ),
      actions
    )}
  </MuiSpeedDial>
)

export default SpeedDial
