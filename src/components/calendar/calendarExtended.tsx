import { exhaustiveCheck } from '../../common/util'
import { Select } from '../../common/formikFields/selectField'
// import * as log from '../../common/log'
import React from 'react'
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

const ADD_EVENT = 'ADD_EVENT'
const REMOVE_EVENT = 'REMOVE_EVENT'
const EDIT_EVENT = 'EDIT_EVENT'

interface AddAction {
  type: typeof ADD_EVENT,
  payload: EventData
}

interface RemoveAction {
  type: typeof REMOVE_EVENT,
  payload: EventData['eventId']
}

interface EditAction {
  type: typeof EDIT_EVENT,
  payload: EventDelta
}

type EventAction = AddAction | RemoveAction | EditAction

const eventsReducer = (events: EventData[], action: EventAction) => {
  switch (action.type) {
    case ADD_EVENT:
      return events.concat(action.payload)
    case REMOVE_EVENT:
      return events.filter(e => e.eventId !== action.payload)
    case EDIT_EVENT:
      return events.map(e => {
        if (e.eventId === action.payload.eventId) {
          return {
            ...e,
            ...action.payload
          }
        } else {
          return e
        }
      })
    default:
      return exhaustiveCheck(action)
  }
}

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
  const [events, dispatch] = React.useReducer(eventsReducer, props.events)
  const [users, setUsers] = React.useState<CalendarUser[]>(props.users)
  const [timezone, setTimezone] = React.useState<string>('local')
  const disableAddingEvents = React.useMemo(() => events.some(e => !!e.isNew), [events])
  const filteredEvents = React.useMemo(
    () => events.filter(e => {
      const eventUserId = e.user.id
      const user = users.find(p => p.id === eventUserId)
      const showEvent = user && user.checked
      return showEvent
    }),
    [events, users]
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
      start: eventData.date,
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
    dispatch({
      payload: combinedData,
      type: ADD_EVENT
    })
    const overlap = checkOverlap(events, combinedData)
    if (overlap) {
      const userName = getUserFullName(users, combinedData.user.id)
      showOverlapAlert(userName)
    }
  }

  const handleRemoveEvent = (id: EventData['eventId']) => {
    dispatch({
      payload: id,
      type: REMOVE_EVENT
    })
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
    dispatch({
      payload: deltaCopy,
      type: EDIT_EVENT
    })

    props.onEditEvent(deltaCopy)
    const currentEvent = events.find(e => e.eventId === deltaCopy.eventId)
    if (currentEvent) {
      const currentEventComplete = {
        ...currentEvent,
        ...deltaCopy
      }
      const overlap = checkOverlap(events, currentEventComplete)
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
