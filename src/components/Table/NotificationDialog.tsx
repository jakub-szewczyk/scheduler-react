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
import { Field, Form, Formik } from 'formik'
import { Select, TextFieldProps } from 'formik-mui'
import { DesktopTimePicker } from 'formik-mui-x-date-pickers'
import { MouseEventHandler } from 'react'
import DraggableDialog, {
  DraggableDialogProps,
} from '../layout/DraggableDialog/DraggableDialog'
import TextSummaryDetail from './TextSummaryDetail'
import TimeSummaryDetail from './TimeSummaryDetail'
import { Row } from './types/Table.types'

interface NotificationDialogProps extends DraggableDialogProps {
  row: Row
  onSave?: MouseEventHandler<HTMLButtonElement> | undefined
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}

interface InitialValues {
  notification: 0 | 5 | 10 | 15 | 'custom'
  time: string | null
}

const initialValues: InitialValues = {
  notification: 0,
  time: null,
}

const NotificationDialog = ({
  row: { starts, ends, room, subject },
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
        <Formik initialValues={initialValues} onSubmit={() => {}}>
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
                    {subject}
                  </TextSummaryDetail>
                  <TextSummaryDetail label='Room'>{room}</TextSummaryDetail>
                  <TimeSummaryDetail label='Starts'>{starts}</TimeSummaryDetail>
                  <TimeSummaryDetail label='Ends'>{ends}</TimeSummaryDetail>
                  <TimeSummaryDetail label='Notification'>
                    {starts}
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
