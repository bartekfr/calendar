import { should } from "chai"

describe('App', () => {
  it('Loads page', () => {
    cy.visit('/')

    cy.get('.fc-view')
  })

  it('Can de/select single user', () => {
    cy.get('.users-list').find('button').as('buttons').should('not.be.disabled')

    cy.get('@buttons').contains('Mark Novak').as('user').invoke('css', 'background-color').then(userColor => {
      cy.get('@user').click()
      cy.get('@user').invoke('css', 'background-color').should('be.eq', 'rgb(255, 255, 255)')

      cy.get('@user').first().click()
      cy.get('@user').invoke('css', 'background-color').should('be.eq', userColor)
    })
  })

  it('Can de/select all users', () => {
    cy.get('.users-list').find('button').as('buttons')
    cy.contains('Select all').as('selectAllBtn')
    cy.contains('Deselect all').as('deselectAllBtn')

    cy.get('@buttons').each($el => {
      cy.wrap($el).invoke('css', 'background-color').should('not.be.eq', 'rgb(255, 255, 255)')
    })

    cy.get('@selectAllBtn').should('be.disabled')
    cy.get('@deselectAllBtn').should('not.be.disabled')

    cy.get('@deselectAllBtn').click()

    cy.get('@selectAllBtn').should('not.be.disabled')
    cy.get('@deselectAllBtn').should('be.disabled')

    cy.get('@buttons').each($el => {
      cy.wrap($el).invoke('css', 'background-color').should('be.eq', 'rgb(255, 255, 255)')
    })

    cy.get('@selectAllBtn').click()

    cy.get('@buttons').each($el => {
      cy.wrap($el).invoke('css', 'background-color').should('not.be.eq', 'rgb(255, 255, 255)')
    })
  })

  it('Filters events based on selected users', () => {
    cy.get('.fc-event[data-user-id=1]').as('user1Events')
    cy.get('.fc-event[data-user-id=2]').as('user2Events')

    cy.get('.users-list [data-id=2]').click()
    cy.get('@user2Events').should('not.exist')
    cy.get('@user1Events')

    cy.get('.users-list [data-id=1]').click()
    cy.get('@user2Events').should('not.exist')
    cy.get('@user1Events').should('not.exist')

    cy.get('.users-list [data-id=2]').click()
    cy.get('@user2Events')
    cy.get('@user1Events').should('not.exist')

    cy.get('.users-list [data-id=1]').click()
    cy.get('@user2Events').should('exist')
    cy.get('@user1Events').should('exist')
  })

})