// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { CssBaseline, ThemeProvider } from '@mui/material'
import { mount } from 'cypress/react18'
import theme from '../../src/theme'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      drag(source: string, destination: string): Cypress.Chainable<unknown>
    }
  }
}

// Example use:
// cy.mount(<MyComponent />)
Cypress.Commands.add('mount', (component, options = {}) =>
  mount(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {component}
    </ThemeProvider>,
    options
  )
)

Cypress.Commands.add('drag', (source, destination) => {
  Cypress.log({
    name: 'drag',
    message: `Dragging ${source} to ${destination}`,
    consoleProps: () => ({
      source,
      destination,
    }),
  })
  cy.get(destination)
    .first()
    .then((destination) => {
      const destinationCoordinates = destination[0].getBoundingClientRect()
      cy.get(source)
        .first()
        .then((source) => {
          const sourceCoordinates = source[0].getBoundingClientRect()
          cy.wrap(source)
            .trigger('mousedown', {
              button: 0,
              clientX: sourceCoordinates.x,
              clientY: sourceCoordinates.y,
              force: true,
            })
            .trigger('mousemove', {
              button: 0,
              clientX: sourceCoordinates.x + 10,
              clientY: sourceCoordinates.y,
              force: true,
            })
          cy.get('body')
            .trigger('mousemove', {
              button: 0,
              clientX: destinationCoordinates.x,
              clientY: destinationCoordinates.y,
              force: true,
            })
            .trigger('mouseup')
        })
    })
})
