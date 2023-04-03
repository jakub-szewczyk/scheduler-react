import Kanban from './Kanban'

beforeEach(() => cy.viewport(1360, 560))

describe('<Kanban />', () => {
  // status
  describe('status', () => {
    describe('using mouse events', () => {
      // left to right mouse events
      it('drags "todo" one column to the right', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.drag(
          '[data-rbd-draggable-id="status-todo"] > .MuiPaper-elevation0',
          '[data-rbd-draggable-id="status-on hold"]'
        )
        cy.get('@todo').invoke('index').should('equal', 1)
        cy.get('@on-hold').invoke('index').should('equal', 0)
      })

      it('drags "todo" two columns to the right', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.drag(
          '[data-rbd-draggable-id="status-todo"] > .MuiPaper-elevation0',
          '[data-rbd-draggable-id="status-inprogress"]'
        )
        cy.get('@todo').invoke('index').should('equal', 2)
        cy.get('@on-hold').invoke('index').should('equal', 0)
        cy.get('@inprogress').invoke('index').should('equal', 1)
      })

      it('drags "todo" all the way to the right', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.drag(
          '[data-rbd-draggable-id="status-todo"] > .MuiPaper-elevation0',
          '[data-rbd-draggable-id="status-done"]'
        )
        cy.get('@todo').invoke('index').should('equal', 3)
        cy.get('@on-hold').invoke('index').should('equal', 0)
        cy.get('@inprogress').invoke('index').should('equal', 1)
        cy.get('@done').invoke('index').should('equal', 2)
      })

      // right to left mouse events
      it('drags "done" one column to the left', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.drag(
          '[data-rbd-draggable-id="status-done"] > .MuiPaper-elevation0',
          '[data-rbd-draggable-id="status-inprogress"]'
        )
        cy.get('@done').invoke('index').should('equal', 2)
        cy.get('@inprogress').invoke('index').should('equal', 3)
      })

      it('drags "done" two columns to the left', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.drag(
          '[data-rbd-draggable-id="status-done"] > .MuiPaper-elevation0',
          '[data-rbd-draggable-id="status-on hold"]'
        )
        cy.get('@done').invoke('index').should('equal', 1)
        cy.get('@inprogress').invoke('index').should('equal', 3)
        cy.get('@on-hold').invoke('index').should('equal', 2)
      })

      it('drags "done" all the way to the left', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.drag(
          '[data-rbd-draggable-id="status-done"] > .MuiPaper-elevation0',
          '[data-rbd-draggable-id="status-todo"]'
        )
        cy.get('@done').invoke('index').should('equal', 0)
        cy.get('@inprogress').invoke('index').should('equal', 3)
        cy.get('@on-hold').invoke('index').should('equal', 2)
        cy.get('@todo').invoke('index').should('equal', 1)
      })
    })

    describe('using keyboard events', () => {
      // left to right keyboard events
      it('drags "todo" one column to the right', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-todo"] > .MuiPaper-elevation0')
          .focus()
          .type(' {rightArrow} ')
        cy.get('@todo').invoke('index').should('equal', 1)
        cy.get('@on-hold').invoke('index').should('equal', 0)
      })

      it('drags "todo" two columns to the right', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-todo"] > .MuiPaper-elevation0')
          .focus()
          .type(' {rightArrow}{rightArrow} ')
        cy.get('@todo').invoke('index').should('equal', 2)
        cy.get('@on-hold').invoke('index').should('equal', 0)
        cy.get('@inprogress').invoke('index').should('equal', 1)
      })

      it('drags "todo" all the way to the right', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-todo"] > .MuiPaper-elevation0')
          .focus()
          .type(' {rightArrow}{rightArrow}{rightArrow} ')
        cy.get('@todo').invoke('index').should('equal', 3)
        cy.get('@on-hold').invoke('index').should('equal', 0)
        cy.get('@inprogress').invoke('index').should('equal', 1)
        cy.get('@done').invoke('index').should('equal', 2)
      })

      // right to left keyboard events
      it('drags "done" one column to the left', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-done"] > .MuiPaper-elevation0')
          .focus()
          .type(' {leftArrow} ')
        cy.get('@done').invoke('index').should('equal', 2)
        cy.get('@inprogress').invoke('index').should('equal', 3)
      })

      it('drags "done" two columns to the left', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-done"] > .MuiPaper-elevation0')
          .focus()
          .type(' {leftArrow}{leftArrow} ')
        cy.get('@done').invoke('index').should('equal', 1)
        cy.get('@inprogress').invoke('index').should('equal', 3)
        cy.get('@on-hold').invoke('index').should('equal', 2)
      })

      it('drags "done" all the way to the left', () => {
        cy.mount(<Kanban />)
        cy.get('[data-rbd-draggable-id="status-done"]')
          .as('done')
          .invoke('index')
          .should('equal', 3)
        cy.get('[data-rbd-draggable-id="status-inprogress"]')
          .as('inprogress')
          .invoke('index')
          .should('equal', 2)
        cy.get('[data-rbd-draggable-id="status-on hold"]')
          .as('on-hold')
          .invoke('index')
          .should('equal', 1)
        cy.get('[data-rbd-draggable-id="status-todo"]')
          .as('todo')
          .invoke('index')
          .should('equal', 0)
        cy.get('[data-rbd-draggable-id="status-done"] > .MuiPaper-elevation0')
          .focus()
          .type(' {leftArrow}{leftArrow}{leftArrow} ')
        cy.get('@done').invoke('index').should('equal', 0)
        cy.get('@inprogress').invoke('index').should('equal', 3)
        cy.get('@on-hold').invoke('index').should('equal', 2)
        cy.get('@todo').invoke('index').should('equal', 1)
      })
    })
  })

  // TODO: Test issue drag and drop
  // issue
  describe('issue', () => {
    describe('using mouse events', () => {
      // top to bottom mouse events
      it('drags issue to the top', () => {})
      // bottom to top mouse events
      it('drags issue to the bottom', () => {})
      // over statuses
      it('drags issue over statuses', () => {})
    })

    describe('using keyboard events', () => {
      // top to bottom keyboard events
      it('drags issue to the top', () => {})
      // bottom to top keyboard events
      it('drags issue to the bottom', () => {})
      // over statuses
      it('drags issue over statuses', () => {})
    })
  })
})
