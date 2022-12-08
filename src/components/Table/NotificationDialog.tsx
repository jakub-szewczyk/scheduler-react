import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Field, Form, Formik, isNaN } from 'formik'
import { Select, TextFieldProps } from 'formik-mui'
import { DesktopTimePicker } from 'formik-mui-x-date-pickers'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import calculateNotificationConfiguration from './functions/calculateNotificationConfiguration'
import subtractMinutes from './functions/subtractMinutes'
import TextSummaryDetail from './TextSummaryDetail'
import TimeSummaryDetail from './TimeSummaryDetail'
import { Row } from './types/Table.types'

interface NotificationDialogProps extends DraggableDialogProps {
  row: Row
  onSave?: MouseEventHandler<HTMLButtonElement> | undefined
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const NotificationDialog = ({
  row,
  onClose,
  onSave = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  onCancel = onClose as MouseEventHandler<HTMLButtonElement> | undefined,
  ...props
}: NotificationDialogProps) => (
  <DraggableDialog
    {...props}
    onClose={onClose}
    dialogTitle='Configure notification'
    dialogContentText={
      <Stack spacing={3}>
        <Typography>
          Change notification settings. Set time and subject details.
        </Typography>
        <Formik
          initialValues={calculateNotificationConfiguration(
            row.starts!,
            row.notification?.time
          )}
          onSubmit={() => {}}
        >
          {({ values }) => (
            <Form>
              <Stack direction='row' columnGap={1.5}>
                <Field
                  component={Select}
                  name='notification'
                  label='Notification'
                  formHelperText={{ children: 'Set notification time' }}
                  formControl={{ size: 'small', sx: { width: '50%' } }}
                >
                  <MenuItem value={0}>Current time</MenuItem>
                  <MenuItem value={5}>5 minutes before</MenuItem>
                  <MenuItem value={10}>10 minutes before</MenuItem>
                  <MenuItem value={15}>15 minutes before</MenuItem>
                  <MenuItem value='custom'>Custom time</MenuItem>
                </Field>
                {values.notification === 'custom' && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Field
                      component={DesktopTimePicker}
                      name='time'
                      renderInput={(params: TextFieldProps) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Time'
                          sx={{ width: '50%' }}
                          inputProps={{
                            ...params.inputProps,
                            placeholder: '',
                          }}
                        />
                      )}
                      OpenPickerButtonProps={{
                        size: 'small',
                        sx: {
                          translate: 6,
                          svg: { width: 20, height: 20 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              </Stack>
              <Accordion
                disableGutters
                sx={{
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  borderRadius: 1,
                  mt: 1.5,
                  '&::before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Summary</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextSummaryDetail label='Subject'>
                    {row.subject}
                  </TextSummaryDetail>
                  <TextSummaryDetail label='Room'>{row.room}</TextSummaryDetail>
                  <TimeSummaryDetail label='Starts'>
                    {row.starts}
                  </TimeSummaryDetail>
                  <TimeSummaryDetail label='Ends'>{row.ends}</TimeSummaryDetail>
                  <TimeSummaryDetail label='Notification'>
                    {isNaN(+values.notification)
                      ? values.time
                      : subtractMinutes(row.starts!, +values.notification)}
                  </TimeSummaryDetail>
                </AccordionDetails>
              </Accordion>
            </Form>
          )}
        </Formik>
      </Stack>
    }
    dialogActions={
      <>
        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
        <Button variant='outlined' onClick={onSave}>
          Save
        </Button>
      </>
    }
  />
)

export default NotificationDialog
