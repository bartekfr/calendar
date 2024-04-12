import { mockEvents } from '../../src/components/calendar/mockData'
import moment from 'moment'

describe('App', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.fc-view')
  })

  it('Can de/select single user', () => {
    cy.get('.users-list').find('button').as('buttons')

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

  it('Clicking event opens Edit Event modal', () => {
    const eventTitle = 'Event no 5'
    const event = mockEvents.find(e => e.title === eventTitle)
    const eventId = event?.eventId
    console.log('id', eventId)
    const eventDate = event && event.start
    const eventDateString = moment(eventDate).format('MM/DD/YYYY HH:mm')

    cy.get(`.fc-event[data-event-id=${eventId}]`).contains(eventTitle).click()

    cy.get('.ReactModal__Content').as('modal')
    cy.get('@modal').contains('Edit Event')
    cy.get('@modal').find('time').should('have.text', eventDateString)
    cy.get('[data-cy="event-title"]')
      .should('have.value', eventTitle)
      .type('{selectAll}{del}Lorem Event')

    cy.get('button[type="submit"]').click()

    cy.get(`.fc-event[data-event-id=${eventId}]`).contains('Lorem Event')
  })
})