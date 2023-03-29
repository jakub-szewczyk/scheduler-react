import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
