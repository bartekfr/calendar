import { Select } from '../../common/formikFields/selectField'
// import * as log from '../../common/log'
import React from 'react'
import { useAppDispatch } from '../../common/hooks'
import eventsSlice from '../../store/events'
import { useToasts } from 'react-toast-notifications';
// import { useToasts } from 'react-toast-notifications'
import Calendar from './calendar'
import { checkOverlap, getUserColor, getUserFullName } from './helpers'
import Users from './users'
import { Toolbar, ToolbarBottom, Wrapper } from './styled'
import { CalendarUser, DateClickData, EventData, EventDelta, UserEventData, RawEventData, Settings } from './types'

const timezoneOptions = [{
  label: 'Local (default)',
  value: 'local'
}, {
  label: 'Warsaw',
  value: 'Europe/Warsaw'
}, {
  label: 'UTC',
  value: 'Etc/UTC'
}]


interface CalendarExtendedProps {
  users: CalendarUser[]
  events: EventData[]
  addingMultipleEvents?: boolean
  onAddEvent: (values: Omit<RawEventData, 'eventId'>) => void
  onEditEvent: (values: EventDelta) => void
  onRemoveEvent: (values: RawEventData['eventId']) => void
  onSettingsUpdate?: (values: Settings) => void
  allEditable?: boolean
}

const CalendarExtended: React.FunctionComponent<CalendarExtendedProps> = props => {
  const dispatch = useAppDispatch()
  const [users, setUsers] = React.useState<CalendarUser[]>(props.users)
  const [timezone, setTimezone] = React.useState<string>('local')
  const disableAddingEvents = React.useMemo(() => props.events.some(e => !!e.isNew), [props.events])
  const filteredEvents = React.useMemo(
    () => props.events.filter(e => {
      const eventUserId = e.user.id
      const user = users.find(p => p.id === eventUserId)
      const showEvent = user && user.checked
      return showEvent
    }),
    [props.events, users]
  )
  const { addToast } = useToasts();
  const showOverlapAlert = (name: string = 'Unknown') => addToast(`Events of ${name} overlap.`, { appearance: 'error', autoDismiss: true })

  const handleAddEvent = (eventData: DateClickData, userData: UserEventData) => {
    const color = getUserColor(userData.userId, users)
    // object with mutation variables that probably will be sent to backend
    const mutationVariables: Omit<RawEventData, 'eventId'> = {
      allDay: eventData.allDay,
      user: {
        id: userData.userId
      },
      privateNote: userData.privateNote,
      publicNote: userData.publicNote,
      start: eventData.date.toISOString(),
      title: 'New Just Added Event'
    }
    props.onAddEvent(mutationVariables)
    // object with data required to updated state after adding new event
    const combinedData = {
      ...mutationVariables,
      color,
      editable: true,
      // event id will be read from API response
      eventId: new Date().getUTCMilliseconds(),
      isNew: true
    }
    dispatch(eventsSlice.actions.add(combinedData))
    const overlap = checkOverlap(props.events, combinedData)
    if (overlap) {
      const userName = getUserFullName(users, combinedData.user.id)
      showOverlapAlert(userName)
    }
  }

  const handleRemoveEvent = (id: EventData['eventId']) => {
    dispatch(eventsSlice.actions.delete(id))
    props.onRemoveEvent(id)
  }

  const handleEdit = (eventDelta: EventDelta) => {
    const user = eventDelta.user
    const deltaCopy = {
      ...eventDelta
    }
    const color = user && getUserColor(user.id, users)
    if (color) {
      deltaCopy.color = color
    }
    dispatch(eventsSlice.actions.edit(deltaCopy))

    props.onEditEvent(deltaCopy)
    const currentEvent = props.events.find(e => e.eventId === deltaCopy.eventId)
    if (currentEvent) {
      const currentEventComplete = {
        ...currentEvent,
        ...deltaCopy
      }
      const overlap = checkOverlap(props.events, currentEventComplete)
      if (overlap) {
        const userName = getUserFullName(users, currentEventComplete.user.id)
        showOverlapAlert(userName)
      }
    }
  }

  return (
    <Wrapper>
      <div>
        <Toolbar>
          <Users
            users={users}
            setUsers={setUsers}
          />
        </Toolbar>
        <ToolbarBottom>
          <Select
            options={timezoneOptions}
            onChange={selected => {
              selected && setTimezone(selected.value)
            }}
            value={timezone}
            label='Select Time Zone'
          />
        </ToolbarBottom>
        <Calendar
          allEditable={props.allEditable}
          events={filteredEvents}
          onAddEvent={handleAddEvent}
          users={users}
          disableAddingEvents={disableAddingEvents && !props.addingMultipleEvents}
          onRemoveEvent={handleRemoveEvent}
          onEdit={handleEdit}
          timeZone={timezone}
        />
      </div>
    </Wrapper>
  )
}

export default CalendarExtended
