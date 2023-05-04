import UpsertStatusDialog from './UpsertStatusDialog'

describe('<UpsertStatusDialog />', () => {
  // Create mode
  describe('create mode', () => {
    it('validates status being required', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='CREATE'
          open
          statuses={[{ title: '', issues: [] }]}
          onCreate={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
    })

    it('validates status being unique', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='CREATE'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onCreate={cy.stub().as('onCreate')}
        />
      )
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('This title has already been used by one of your statuses')
    })

    it('creates new status despite initial validation fail', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='CREATE'
          open
          statuses={[{ title: '', issues: [] }]}
          onCreate={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('be.calledOnce')
    })
  })

  // Insert before mode
  describe('insert before mode', () => {
    it('validates status being required', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='INSERT_BEFORE'
          open
          statuses={[{ title: '', issues: [] }]}
          onInsertBefore={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
    })

    it('validates status being unique', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='INSERT_BEFORE'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onInsertBefore={cy.stub().as('onCreate')}
        />
      )
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('This title has already been used by one of your statuses')
    })

    it('creates new status despite initial validation fail', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='INSERT_BEFORE'
          open
          statuses={[{ title: '', issues: [] }]}
          onInsertBefore={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('be.calledOnce')
    })
  })

  // Insert after mode
  describe('insert after mode', () => {
    it('validates status being required', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='INSERT_AFTER'
          open
          statuses={[{ title: '', issues: [] }]}
          onInsertAfter={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
    })

    it('validates status being unique', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='INSERT_AFTER'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onInsertAfter={cy.stub().as('onCreate')}
        />
      )
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('This title has already been used by one of your statuses')
    })

    it('creates new status despite initial validation fail', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='INSERT_AFTER'
          open
          statuses={[{ title: '', issues: [] }]}
          onInsertAfter={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('be.calledOnce')
    })
  })

  // Edit mode
  describe('edit mode', () => {
    it('validates status being required', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='EDIT'
          open
          status={{ title: 'backlog', issues: [] }}
          statuses={[{ title: '', issues: [] }]}
          onEdit={cy.stub().as('onCreate')}
        />
      )
      cy.get('input[name="title"]').clear()
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
    })

    it("doesn't validate status being unique", () => {
      cy.mount(
        <UpsertStatusDialog
          mode='EDIT'
          open
          status={{ title: 'backlog', issues: [] }}
          statuses={[{ title: 'backlog', issues: [] }]}
          onEdit={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('be.calledOnce')
    })

    it('edits status despite initial validation fail', () => {
      cy.mount(
        <UpsertStatusDialog
          mode='EDIT'
          open
          status={{ title: 'backlog', issues: [] }}
          statuses={[{ title: '', issues: [] }]}
          onEdit={cy.stub().as('onCreate')}
        />
      )
      cy.get('input[name="title"]').clear()
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('Required')
      cy.get('input[name="title"]').type('backlog')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('be.calledOnce')
    })
  })
})
