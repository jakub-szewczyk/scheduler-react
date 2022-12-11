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
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { Select, TextFieldProps } from 'formik-mui'
import { DesktopTimePicker } from 'formik-mui-x-date-pickers'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import validationSchema from './constants/validationSchema'
import calculateNotificationConfiguration from './functions/calculateNotificationConfiguration'
import calculateNotificationTime from './functions/calculateNotificationTime'
import TextSummaryDetail from './TextSummaryDetail'
import TimeSummaryDetail from './TimeSummaryDetail'
import { NotificationConfiguration, Row } from './types/Table.types'

interface NotificationDialogProps extends DraggableDialogProps {
  row: Row & { starts: string }
  onSave: (
    values: NotificationConfiguration,
    formikHelpers: FormikHelpers<NotificationConfiguration>
  ) => void
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

const NotificationDialog = ({
  row,
  onSave,
  onClose,
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
            row.starts,
            row.notification?.time
          )}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          {({ values, touched, errors }) => (
            <Form id='notification'>
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
                          name='time'
                          size='small'
                          label='Time'
                          error={touched['time'] && !!errors['time']}
                          helperText={
                            touched['time'] ? errors['time'] : undefined
                          }
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
                    {calculateNotificationTime(row.starts, values)}
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
        <Button type='submit' form='notification' variant='outlined'>
          Save
        </Button>
      </>
    }
  />
)

export default NotificationDialog
