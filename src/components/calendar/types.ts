import FullCalendar from '@fullcalendar/react'

type FullCalendarProps = React.ComponentProps<typeof FullCalendar>
type DateClick = NonNullable<FullCalendarProps['dateClick']>
export type DateClickData = Parameters<DateClick>[0]

type EventClick = NonNullable<FullCalendarProps['eventClick']>
export type InfoEvent = Parameters<EventClick>[0]['event']

export interface RawEventData {
  allDay: boolean
  eventId: number // distinguish from FullCalendar 'id' prop
  user: User
  start: Date
  end?: Date
  title: string
  privateNote?: string
  publicNote?: string
}

export interface EventData extends RawEventData {
  color: string
  editable?: boolean
  isNew?: boolean
}

export interface User {
  id: number
  firstName?: string
  lastName?: string
}

export type CalendarUser = User & {
  color: string
  checked?: boolean
}

export type UserEventData = {
  userId: User['id']
} & Pick<EventData, 'privateNote' | 'publicNote'>

type EditableFields = 'allDay' | 'end' | 'start' | 'user' | 'publicNote' | 'privateNote' | 'color'
export type EventDelta = Pick<EventData, 'eventId'> & Partial<Pick<EventData, EditableFields>>

export enum DaysOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

export interface BusinessDayHours {
  daysOfWeek: number[],
  startTime: string,
  endTime: string
}

// will include more settings
export interface Settings {
  businessDayHours: BusinessDayHours
  firstDay: number
  time12h: boolean
  showWeather: boolean
}

export interface DailyWeather {
  dt: number
  temp: {
    day: number
  }
  weather: Array<{
    icon: string
  }>
}

export interface OpenWeatherResponse {
  daily: DailyWeather[]
}
