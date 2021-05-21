import { themeColors } from '../../common/colors'
import moment from 'moment'
import { CalendarUser, EventData, User, RawEventData } from './types'

export const fallbackColor = '#aaa'
const defaultEventDurationHour = 1

const generateRainbowColor = (indexOfRainbowColor: number, numberOfRainbowColors: number) => {
  let r = 0
  let g = 0
  let b = 0
  const h = (indexOfRainbowColor + 1) / numberOfRainbowColors
  const i = ~~(h * 6) // tslint:disable-line
  const f = h * 6 - i
  const q = 1 - f
  switch (i % 6) {
    case 0:
      r = 1
      g = f
      b = 0
      break
    case 1:
      r = q
      g = 1
      b = 0
      break
    case 2:
      r = 0
      g = 1
      b = f
      break
    case 3:
      r = 0
      g = q
      b = 1
      break
    case 4:
      r = f
      g = 0
      b = 1
      break
    case 5:
      r = 1
      g = 0
      b = q
      break
  }
  // tslint:disable-next-line
  const c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2)
  return c
}

// In most cases there will be only 2 - 3 users from given region and we want to use our theme colors for them
// if there are more users generated rainbow color will be assigned to them
export const UsersColors = [themeColors.BLUE, themeColors.GREEN, themeColors.ORANGE]

export const initializeUsersData = (users: User[]): CalendarUser[] =>
  users.map((p, i) => ({
    ...p,
    checked: true,
    color: UsersColors[i] || generateRainbowColor(i, users.length)
  }))

export const assignUsersColorsToEvents = (events: RawEventData[], users: CalendarUser[]): EventData[] => {
  return events.map(e => {
    const eventUser = users.find(p => p.id === e.user.id)
    const userColor = eventUser ? eventUser.color : fallbackColor

    return {
      ...e,
      color: userColor
    }
  })
}

export const getUserColor = (id: CalendarUser['id'], users: CalendarUser[]) => {
  const user = users.find(p => p.id === id)
  return user ? user.color : fallbackColor
}

export const checkOverlap = (events: EventData[], eventA: EventData) => {
  const res = events.filter(eventB => {
    return eventB.user.id === eventA.user.id && eventA.eventId !== eventB.eventId
  })
    .some(eventB => {
      const eventAStart = moment(eventA.start)
      const eventAEnd = eventA.end ? moment(eventA.end) : eventAStart.clone().add(defaultEventDurationHour, 'hour')

      const eventBStart = moment(eventB.start)
      const eventBEnd = eventB.end ? moment(eventB.end) : eventBStart.clone().add(defaultEventDurationHour, 'hour')

      const theSameDay = eventAStart.isSame(eventBStart, 'day')
      if (theSameDay && (eventA.allDay || eventB.allDay)) {
        return true
      }
      const startOverlap = eventAStart.isBetween(eventBStart, eventBEnd, 'minute', '[)')
      if (startOverlap) {
        return true
      }
      const endOverlap = eventAEnd.isBetween(eventBStart, eventBEnd, 'minute', '(]')
      if (endOverlap) {
        return true
      }

      const eventBWithinEventATime = eventAStart.isBefore(eventBStart, 'minute') && eventAEnd.isAfter(eventBEnd, 'minute')
      return eventBWithinEventATime
    })
  return res
}

export const getUserFullName = (users: User[], id: User['id']) => {
  const userData = users.find(p => p.id === id)
  const userName = userData && `${userData.firstName} ${userData.lastName}`
  return userName
}
