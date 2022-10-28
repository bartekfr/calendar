describe('App', () => {
  it('Load page', () => {
    cy.visit('/')

    cy.get('#root')
  })

  it('Users list displays items', () => {
    cy.visit('/')

    cy.get('.users-list').find('button').as('buttons').should('not.be.disabled')

    cy.get('@buttons').contains('Mark Novak').as('user').invoke('css', 'background-color').as('userColor')
    cy.get('@user').first().click()
    cy.get('@user').invoke('css', 'background-color').should('be.eq', 'rgb(255, 255, 255)')

    cy.get('@user').first().click()
    cy.get('@user').invoke('css', 'background-color').should('be.eq', this.userColor)
  })
})