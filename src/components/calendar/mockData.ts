import { RawEventData } from './types'

// temp function that can be removed when events API integration is finished
export const getShiftedDate = (days: number, hour: number) => {
  const today = new Date()
  const newDate = new Date(today)
  newDate.setDate(newDate.getDate() + days)
  newDate.setHours(hour, 0, 0, 0)
  return new Date(newDate).toISOString()
}

// replace with fetched Users when users API is completed
export const mockUsers = [{
  firstName: 'John',
  id: 1,
  lastName: 'Smith'
}, {
  firstName: 'Mark',
  id: 2,
  lastName: 'Novak'
}, {
  firstName: 'Justin',
  id: 3,
  lastName: 'Jackson'
}, {
  firstName: 'Elen',
  id: 4,
  lastName: 'Evans'
}, {
  firstName: 'Max',
  id: 5,
  lastName: 'Johanson'
}]

/**
 * Make sure mock users with id 1 and 2 are always visible for test
 */
export const mockEvents: RawEventData[] = [{
  allDay: false,
  eventId: 1,
  user: mockUsers[0],
  start: getShiftedDate(0, 11),
  title: `Event no 1`
}, {
  allDay: false,
  eventId: 2,
  user: mockUsers[0],
  start: getShiftedDate(-1, 12),
  title: `Event no 2`
}, {
  allDay: false,
  eventId: 3,
  user: mockUsers[1],
  start: getShiftedDate(0, 15),
  title: `Event no 3`
}, {
  allDay: false,
  eventId: 4,
  user: mockUsers[1],
  start: getShiftedDate(-1, 11),
  title: `Event no 4`
}, {
  allDay: false,
  eventId: 5,
  user: mockUsers[1],
  start: getShiftedDate(1, 11),
  title: `Event no 5`
}, {
  allDay: false,
  eventId: 6,
  user: mockUsers[0],
  start: getShiftedDate(-1, 13),
  title: `Event no 6`
}, {
  allDay: false,
  eventId: 7,
  user: mockUsers[3],
  start: getShiftedDate(1, 14),
  title: `Event no 7`
}, {
  allDay: false,
  eventId: 8,
  user: mockUsers[2],
  start: getShiftedDate(-1, 14),
  title: `Event no 8`
}]
