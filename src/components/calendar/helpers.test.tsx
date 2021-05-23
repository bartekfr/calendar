import {
  assignUsersColorsToEvents,
  fallbackColor,
  getUserColor,
  getUserFullName,
  initializeUsersData
} from './helpers'
import { mockEvents, mockUsers } from './mockData'

describe('Calendar helpers tests', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Initializes users data', () => {
    const mockColorUsers = initializeUsersData(mockUsers)
    const hexColorRegex = /^#[0-9a-f]{3,6}$/i

    mockUsers.forEach(user => {
      expect(user).toEqual(expect.not.objectContaining({
        checked: true,
        color: expect.any(String)
      }))
    })

    mockColorUsers.forEach(user => {
      expect(user).toEqual(expect.objectContaining({
        checked: true,
        color: expect.stringMatching(hexColorRegex)
      }))
    })
  })

  it('Assigns users colors to events', () => {
    const mockColorUsers = initializeUsersData(mockUsers)
    const mockEventsWithColors = assignUsersColorsToEvents(mockEvents, mockColorUsers)

    mockEventsWithColors.forEach(event => {
      const eventUser = mockColorUsers.find(p => p.id === event.user.id)
      const expectedColor = eventUser ? eventUser.color : fallbackColor
      expect(event.color).toBe(expectedColor)
    })
  })

  it('Returns user color', () => {
    const mockColorUsers = initializeUsersData(mockUsers)

    mockColorUsers.forEach(p => {
      const color = getUserColor(p.id, mockColorUsers)
      expect(color).toBe(p.color)
    })

    const nonExistingUserId = 100

    expect(getUserColor(nonExistingUserId, mockColorUsers)).toBe(fallbackColor)
  })

  it('Returns user full name', () => {
    const mockColorUsers = initializeUsersData(mockUsers)

    expect(getUserFullName(mockColorUsers, 1)).toBe('John Smith')
    expect(getUserFullName(mockColorUsers, 3)).toBe('Justin Jackson')
    expect(getUserFullName(mockColorUsers, 5)).toBe('Max Johanson')
  })
})
