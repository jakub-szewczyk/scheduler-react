import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  MenuItem,
  Stack,
  TextField as MuiTextField,
  Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { Select, TextField, TextFieldProps } from 'formik-mui'
import { DesktopTimePicker } from 'formik-mui-x-date-pickers'
import { MouseEventHandler } from 'react'
import * as NOTIFICATION from '../../modules/notification'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import validationSchema from './validation/validationSchema'
import TextSummaryDetail from './TextSummaryDetail'
import TimeSummaryDetail from './TimeSummaryDetail'
import { Row } from '../../types/row'
import { NotificationConfiguration } from '../../types/notification'

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
    dialogContent={
      <Stack spacing={3}>
        <Typography>
          Change notification settings. Set time and title details.
        </Typography>
        <Formik
          initialValues={NOTIFICATION.calculateConfiguration(
            row.starts,
            row.notification?.time,
            row.notification?.title
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
                        <MuiTextField
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
              <Field
                component={TextField}
                name='title'
                size='small'
                label='Title'
                margin='normal'
                helperText='Set notification title'
                fullWidth
              />
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
                    {NOTIFICATION.calculateTime(row.starts, values)}
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
