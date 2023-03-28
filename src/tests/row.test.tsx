import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

it('sets starts to 08:00 am', async () => {
  render(<App />)
  const user = userEvent.setup()
  const textbox = within(
    screen.getByRole('row', {
      name: /monday/i,
    })
  ).getAllByRole('textbox')[0]!
  await user.type(textbox, '0800a')
  expect(textbox).toHaveDisplayValue('08:00 am')
})

it('sets ends to 09:30 am', async () => {
  render(<App />)
  const user = userEvent.setup()
  const textbox = within(
    screen.getByRole('row', {
      name: /monday/i,
    })
  ).getAllByRole('textbox')[1]!
  await user.type(textbox, '0930a')
  expect(textbox).toHaveDisplayValue('09:30 am')
})

it('sets room to 110', async () => {
  render(<App />)
  const user = userEvent.setup()
  const cell = within(
    screen.getByRole('row', {
      name: /monday/i,
    })
  ).getAllByRole('cell')[3]
  await user.dblClick(cell)
  const input = cell.querySelector('input')!
  await user.type(input, '110')
  expect(input).toHaveDisplayValue('110')
})

it('sets subject to mathematics', async () => {
  render(<App />)
  const user = userEvent.setup()
  const cell = within(
    screen.getByRole('row', {
      name: /monday/i,
    })
  ).getAllByRole('cell')[4]
  await user.dblClick(cell)
  const input = cell.querySelector('input')!
  await user.type(input, 'mathematics')
  expect(input).toHaveDisplayValue('mathematics')
})
