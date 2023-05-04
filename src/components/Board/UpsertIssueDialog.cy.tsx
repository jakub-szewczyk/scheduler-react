import UpsertIssueDialog from './UpsertIssueDialog'

describe('<UpsertIssueDialog />', () => {
  // Create mode
  describe('create mode', () => {
    it('validates title and description being required', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='CREATE'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onCreate={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
    })

    it('validates title being unique', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='CREATE'
          open
          statuses={[
            {
              title: 'backlog',
              issues: [
                {
                  title: 'Cloud infrastructure overview',
                  content:
                    "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
                },
              ],
            },
          ]}
          onCreate={cy.stub().as('onCreate')}
        />
      )
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.contains('This title has already been used by one of your issues')
    })

    it('creates new issue despite initial validation fail', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='CREATE'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onCreate={cy.stub().as('onCreate')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('button[type="submit"]').click()
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 1)
      cy.get('textarea[name="content"]').type(
        "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work."
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onCreate').should('be.calledOnce')
    })
  })

  // Insert above mode
  describe('insert above mode', () => {
    it('validates title and description being required', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='INSERT_ABOVE'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onInsertAbove={cy.stub().as('onInsertAbove')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertAbove').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
    })

    it('validates title being unique', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='INSERT_ABOVE'
          open
          statuses={[
            {
              title: 'backlog',
              issues: [
                {
                  title: 'Cloud infrastructure overview',
                  content:
                    "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
                },
              ],
            },
          ]}
          onInsertAbove={cy.stub().as('onInsertAbove')}
        />
      )
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertAbove').should('not.be.calledOnce')
      cy.contains('This title has already been used by one of your issues')
    })

    it('creates new issue despite initial validation fail', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='INSERT_ABOVE'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onInsertAbove={cy.stub().as('onInsertAbove')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertAbove').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('button[type="submit"]').click()
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 1)
      cy.get('textarea[name="content"]').type(
        "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work."
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertAbove').should('be.calledOnce')
    })
  })

  // Insert below mode
  describe('insert below mode', () => {
    it('validates title and description being required', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='INSERT_BELOW'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onInsertBelow={cy.stub().as('onInsertBelow')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertBelow').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
    })

    it('validates title being unique', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='INSERT_BELOW'
          open
          statuses={[
            {
              title: 'backlog',
              issues: [
                {
                  title: 'Cloud infrastructure overview',
                  content:
                    "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
                },
              ],
            },
          ]}
          onInsertBelow={cy.stub().as('onInsertBelow')}
        />
      )
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertBelow').should('not.be.calledOnce')
      cy.contains('This title has already been used by one of your issues')
    })

    it('creates new issue despite initial validation fail', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='INSERT_BELOW'
          open
          statuses={[{ title: 'backlog', issues: [] }]}
          onInsertBelow={cy.stub().as('onInsertBelow')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertBelow').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('button[type="submit"]').click()
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 1)
      cy.get('textarea[name="content"]').type(
        "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work."
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onInsertBelow').should('be.calledOnce')
    })
  })

  // Edit mode
  describe('edit mode', () => {
    it('validates issue being required', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='EDIT'
          open
          issue={{
            title: 'Cloud infrastructure overview',
            content:
              "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
          }}
          statuses={[
            {
              title: 'backlog',
              issues: [
                {
                  title: 'Cloud infrastructure overview',
                  content:
                    "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
                },
              ],
            },
          ]}
          onEdit={cy.stub().as('onEdit')}
        />
      )
      cy.get('input[name="title"]').clear()
      cy.get('textarea[name="content"]').clear()
      cy.get('button[type="submit"]').click()
      cy.get('@onEdit').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
    })

    it("doesn't validate issue being unique", () => {
      cy.mount(
        <UpsertIssueDialog
          mode='EDIT'
          open
          issue={{
            title: 'Cloud infrastructure overview',
            content:
              "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
          }}
          statuses={[
            {
              title: 'backlog',
              issues: [
                {
                  title: 'Cloud infrastructure overview',
                  content:
                    "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
                },
              ],
            },
          ]}
          onEdit={cy.stub().as('onEdit')}
        />
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onEdit').should('be.calledOnce')
    })

    it('edits issue despite initial validation fail', () => {
      cy.mount(
        <UpsertIssueDialog
          mode='EDIT'
          open
          issue={{
            title: 'Cloud infrastructure overview',
            content:
              "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
          }}
          statuses={[
            {
              title: 'backlog',
              issues: [
                {
                  title: 'Cloud infrastructure overview',
                  content:
                    "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work.",
                },
              ],
            },
          ]}
          onEdit={cy.stub().as('onEdit')}
        />
      )
      cy.get('input[name="title"]').clear()
      cy.get('textarea[name="content"]').clear()
      cy.get('button[type="submit"]').click()
      cy.get('@onEdit').should('not.be.calledOnce')
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2)
      cy.get('input[name="title"]').type('Cloud infrastructure overview')
      cy.get('textarea[name="content"]').type(
        "Ask about cloud services that this project will need. Do research on currently available options that could be used as a workaround if ones suggested by the client won't work."
      )
      cy.get('button[type="submit"]').click()
      cy.get('@onEdit').should('be.calledOnce')
    })
  })
})
