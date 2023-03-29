import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

beforeEach(() => localStorage.clear())

it('saves and renames', async () => {
  render(<App />)
  const user = userEvent.setup()
  await user.click(
    screen.getByRole('button', {
      name: /speed-dial/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  expect(await screen.findByText(/required/i)).toBeVisible()
  await user.type(
    screen.getByRole('textbox', {
      name: /name/i,
    }),
    'Tough Mondays'
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  expect(await screen.findByText(/tough mondays/i)).toBeVisible()
  await user.click(
    within(await screen.findByRole('grid')).getByTestId('EditIcon')
  )
  await user.clear(
    screen.getByRole('textbox', {
      name: /name/i,
    })
  )
  await user.type(
    screen.getByRole('textbox', {
      name: /name/i,
    }),
    'unsaved'
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  expect(
    await screen.findByText(
      /this name has been set aside for exclusive purposes/i
    )
  ).toBeVisible()
  await user.clear(
    screen.getByRole('textbox', {
      name: /name/i,
    })
  )
  await user.type(
    screen.getByRole('textbox', {
      name: /name/i,
    }),
    'Easy Mondays'
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  expect(await screen.findByText(/easy mondays/i)).toBeVisible()
}, 10000)

it('selects and removes', async () => {
  render(<App />)
  const user = userEvent.setup()
  await user.click(
    screen.getByRole('button', {
      name: /speed-dial/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  expect(
    screen.getByRole('button', {
      name: /new schedule/i,
    })
  ).toBeDisabled()
  await user.hover(
    screen.getByRole('button', {
      name: /new schedule/i,
    }).parentElement!
  )
  expect(
    await screen.findByText(
      /all schedules must be saved before creating a new one/i
    )
  ).toBeVisible()
  await user.keyboard('{Escape}')
  expect(
    screen.queryByRole('heading', {
      name: /create or load schedules/i,
    })
  ).not.toBeInTheDocument()
  await user.click(
    screen.getByRole('button', {
      name: /speed-dial/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  await user.type(
    screen.getByRole('textbox', {
      name: /name/i,
    }),
    'Tough Mondays'
  )
  await user.click(
    screen.getByRole('button', {
      name: /save/i,
    })
  )
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', {
        name: /save schedule/i,
      })
    ).not.toBeInTheDocument()
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  expect(
    screen.getByRole('button', {
      name: /new schedule/i,
    })
  ).toBeEnabled()
  await user.click(
    screen.getByRole('button', {
      name: /new schedule/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  expect(
    screen.queryByRole('heading', {
      name: /create or load schedules/i,
    })
  ).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /tough mondays/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  expect(
    screen.queryByRole('heading', {
      name: /create or load schedules/i,
    })
  ).toBeVisible()
  await user.click(screen.getAllByTestId('CloseIcon')[0])
  expect(
    screen.getByRole('heading', {
      name: /delete schedule/i,
    })
  ).toBeVisible()
  await user.click(
    screen.getByRole('button', {
      name: /delete/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
  expect(
    screen.queryByRole('heading', {
      name: /create or load schedules/i,
    })
  ).toBeVisible()
  await user.hover(
    screen.getByTestId('CloseIcon').parentElement!.parentElement!
  )
  expect(
    await screen.findByText(/at least one schedule is required/i)
  ).toBeVisible()
}, 30000)

it('exports as .xlsx', async () => {
  render(<App />)
  const user = userEvent.setup()
  await user.click(
    screen.getByRole('button', {
      name: /speed-dial/i,
    })
  )
  await user.keyboard('{ArrowUp}')
  await user.keyboard('{Enter}')
})
