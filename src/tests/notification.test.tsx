import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from '../App'

beforeEach(() => localStorage.clear())

it('turns on', async () => {
  render(<App />)
  const user = userEvent.setup()
  const button = within(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('cell')[5]
  ).getByRole('button')
  await user.hover(button.parentElement!)
  expect(button).toBeDisabled()
  expect(
    await screen.findByText(/set start time to enable notification/i)
  ).toBeVisible()
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[0]!,
    '0800a'
  )
  await user.hover(button.parentElement!)
  expect(button).toBeEnabled()
  expect(await screen.findByText(/right-click to configure/i)).toBeVisible()
  await user.click(button)
}, 10000)

it('saves configuration via dialog', async () => {
  render(<App />)
  const user = userEvent.setup()
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[0]!,
    '0800a'
  )
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[1]!,
    '0930a'
  )
  await user.dblClick(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('cell')[3]
  )
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    )
      .getAllByRole('cell')[3]
      .querySelector('input')!,
    '110'
  )
  await user.dblClick(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('cell')[4]
  )
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    )
      .getAllByRole('cell')[4]
      .querySelector('input')!,
    'mathematics'
  )
  fireEvent.contextMenu(
    within(
      within(
        screen.getByRole('row', {
          name: /monday/i,
        })
      ).getAllByRole('cell')[5]
    ).getByRole('button')
  )
  await user.click(screen.getByTestId('ExpandMoreIcon'))
  expect(screen.getByText(/subject: mathematics/i)).toBeVisible()
  expect(screen.getByText(/room: 110/i)).toBeVisible()
  expect(screen.getByText(/starts: 08:00 am/i)).toBeVisible()
  expect(screen.getByText(/ends: 09:30 am/i)).toBeVisible()
  expect(screen.getByText(/notification: 08:00 am/i)).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /current time/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: '5 minutes before',
    })
  )
  expect(screen.getByText(/notification: 07:55 am/i)).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /5 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: '10 minutes before',
    })
  )
  expect(screen.getByText(/notification: 07:50 am/i)).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /10 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: '15 minutes before',
    })
  )
  expect(screen.getByText(/notification: 07:45 am/i)).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /15 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: /custom time/i,
    })
  )
  await user.clear(
    screen.getByRole('textbox', {
      name: /time/i,
    })
  )
  await user.type(
    screen.getByRole('textbox', {
      name: /title/i,
    }),
    'Mathematics in 20 minutes'
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  expect(screen.getByText(/required/i)).toBeVisible()
  await user.type(
    screen.getByRole('textbox', {
      name: /time/i,
    }),
    '0740a'
  )
  expect(screen.getByText(/notification: 07:40 am/i)).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /custom time/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: /current time/i,
    })
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
}, 45000)

it('triggers at current time', async () => {
  const NotificationMock = vi.fn()
  // @ts-expect-error
  NotificationMock.permission = 'granted'
  vi.stubGlobal('Notification', NotificationMock)
  vi.useFakeTimers()
  vi.setSystemTime(new Date(1970, 1, 1, 8))
  render(<App />)
  const user = userEvent.setup({ delay: null })
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[0]!,
    '0800a'
  )
  await user.click(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  vi.advanceTimersByTime(1000)
  fireEvent.contextMenu(
    within(
      within(
        screen.getByRole('row', {
          name: /monday/i,
        })
      ).getAllByRole('cell')[5]
    ).getByRole('button')
  )
  await user.click(
    await screen.findByRole('button', {
      name: /current time/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: '5 minutes before',
    })
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  await user.click(screen.getByTestId('NotificationsIcon'))
  await waitFor(() =>
    fireEvent.contextMenu(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  )
  await user.click(
    screen.getByRole('button', {
      name: /5 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: /10 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  await waitFor(() =>
    fireEvent.contextMenu(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  )
  await user.click(
    screen.getByRole('button', {
      name: /10 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: /15 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  await waitFor(() =>
    fireEvent.contextMenu(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  )
  await user.click(
    screen.getByRole('button', {
      name: /15 minutes before/i,
    })
  )
  await user.click(
    screen.getByRole('option', {
      name: /custom time/i,
    })
  )
  await user.type(
    screen.getByRole('textbox', {
      name: /time/i,
    }),
    '{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}{Delete}'
  )
  await user.type(
    screen.getByRole('textbox', {
      name: /time/i,
    }),
    '0740am'
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  await waitFor(() =>
    fireEvent.contextMenu(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  )
  vi.useRealTimers()
  vi.unstubAllGlobals()
}, 20000)

it('triggers 5 minutes before', async () => {
  const NotificationMock = vi.fn()
  // @ts-expect-error
  NotificationMock.permission = 'granted'
  vi.stubGlobal('Notification', NotificationMock)
  vi.useFakeTimers()
  vi.setSystemTime(new Date(1970, 1, 1, 7, 55))
  render(<App />)
  const user = userEvent.setup({ delay: null })
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[0]!,
    '0755a'
  )
  await user.click(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  vi.advanceTimersByTime(1000)
  vi.useRealTimers()
  vi.unstubAllGlobals()
}, 15000)

it('triggers 10 minutes before', async () => {
  const NotificationMock = vi.fn()
  // @ts-expect-error
  NotificationMock.permission = 'granted'
  vi.stubGlobal('Notification', NotificationMock)
  vi.useFakeTimers()
  vi.setSystemTime(new Date(1970, 1, 1, 7, 50))
  render(<App />)
  const user = userEvent.setup({ delay: null })
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[0]!,
    '0750a'
  )
  await user.click(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  vi.advanceTimersByTime(1000)
  vi.useRealTimers()
  vi.unstubAllGlobals()
}, 15000)

it('triggers 15 minutes before', async () => {
  const NotificationMock = vi.fn()
  // @ts-expect-error
  NotificationMock.permission = 'denied'
  // @ts-expect-error
  NotificationMock.requestPermission = vi.fn(() => Promise.resolve())
  vi.stubGlobal('Notification', NotificationMock)
  vi.useFakeTimers()
  vi.setSystemTime(new Date(1970, 1, 1, 7, 45))
  render(<App />)
  const user = userEvent.setup({ delay: null })
  await user.type(
    within(
      screen.getByRole('row', {
        name: /monday/i,
      })
    ).getAllByRole('textbox')[0]!,
    '0745a'
  )
  await user.click(screen.getAllByTestId('NotificationsNoneIcon')[0]!)
  vi.advanceTimersByTime(1000)
  vi.useRealTimers()
  vi.unstubAllGlobals()
}, 15000)
