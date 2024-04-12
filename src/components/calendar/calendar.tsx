/* tslint:disable:no-implicit-dependencies */
import styled from 'styled-components'
import '@fullcalendar/core/main.css'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/daygrid/main.css'
import interactionPlugin from '@fullcalendar/interaction'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import '@fullcalendar/timegrid/main.css'
import React from 'react'
import EventModal from './addEventModal'
import DateWarningModal from './dateClickWarning'
import DeleteWarningModal from './deleteWarning'
import { DateClickData, EventData, EventDelta, InfoEvent, User, UserEventData } from './types'

const CalendarStyled = styled.div`
  .fc-header-toolbar {
    font-size: 13px;

    @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
      .fc-left {
        width: 320px;
      }
    }
  }

  .fc-event:hover {
    .cal-event-remove {
      display: block;
    }
  }

  .fc-time-grid {
    .cal-weather {
      display: none;
    }
  }

  .fc-timeGrid-view .fc-day-grid .fc-row .fc-content-skeleton {
    padding-bottom: 100px;
  }

  .fc-day-grid {
    .fc-day {
      position: relative;

      .cal-weather {
        width: 100px;
        height: 100px;
        position: absolute;
        bottom: 0;
        margin-left: 50%;
        left: -50px;
      }

      @media (max-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
        .cal-weather {
          width: 70px;
          height: 70px;
          left: -35px;
        }
      }
    }
  }

  .cal-event-remove {
    display: none;
    position: absolute;
    top: 2px;
    right: 2px;
    height: 14px;
    width: 14px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 25px;
    font-weight: 500;
    text-align: center;
    line-height: 15px;
    color: ${props => props.theme.colors.BORDER};
    z-index: 100;
  }
`

interface CalendarProps {
  events: EventData[]
  onAddEvent: (eventData: DateClickData, userData: UserEventData) => void
  users: User[]
  disableAddingEvents?: boolean
  onRemoveEvent: (id: EventData['eventId']) => void
  onEdit: (event: EventDelta) => void
  allEditable?: boolean
  timeZone: string
}

const Calendar: React.FunctionComponent<CalendarProps> = props => {
  const [eventModalVisible, toggleEventModal] = React.useState(false)
  const [dateClickWarningVisible, toggleDateClickWarning] = React.useState(false)
  const [eventEditModalVisible, toggleEventEditModal] = React.useState(false)
  const [deleteModalVisible, toggleDeleteModal] = React.useState(false)
  const [tempEvent, saveTempEvent] = React.useState<DateClickData>()
  const [editedEventId, setEditedEventId] = React.useState<number>()

  const eventIdToRemove = React.useRef<number>(-1)
  const eventRemoveBtns = React.useRef<HTMLElement[]>([])

  const editedEvent = React.useMemo(() => props.events.find(e => e.eventId === editedEventId), [props.events, editedEventId])

  const handleDateClick = (event: DateClickData) => {
    if (props.disableAddingEvents) {
      toggleDateClickWarning(true)
      return
    }
    toggleEventModal(true)
    saveTempEvent(event)
    console.log('Date click', event)
  }

  const addEvent = (userData: UserEventData) => {
    if (tempEvent) {
      props.onAddEvent(tempEvent, userData)
      saveTempEvent(undefined)
    }
    toggleEventModal(false)
  }

  const showDeleteModal = (e: MouseEvent) => {
    // https://stackoverflow.com/a/50326668
    if (e.target instanceof HTMLSpanElement) {
      const id = e.target.getAttribute('data-event-id')
      eventIdToRemove.current = Number(id)
      toggleDeleteModal(true)
    }

  }

  React.useEffect(() => () => {
    console.log('Calendar unmount')
    eventRemoveBtns.current.forEach(el => el.removeEventListener('click', showDeleteModal))
  }, [])

  const handleEdit = (event: InfoEvent) => {
    const now = new Date()
    props.onEdit({
      allDay: event.allDay,
      end: event.end ? event.end.toISOString() : undefined,
      eventId: event.extendedProps.eventId,
      start: event.start ? event.start.toISOString() : now.toISOString()
    })
  }

  return (
    <>
      <CalendarStyled>
        <FullCalendar
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false
          }}
          defaultView='timeGridWeek'
          header={{
            center: 'title',
            left: ' ',
            right: 'prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          plugins={[momentTimezonePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={props.events}
          dateClick={handleDateClick}
          eventRender={info => {
            if (!info.event.extendedProps.isNew && !props.allEditable) {
              return
            }
            const eventId = info.event.extendedProps.eventId
            const removeBtnEl = document.createElement('span')
            removeBtnEl.innerHTML = '&times;'
            removeBtnEl.className = 'cal-event-remove'
            info.el.setAttribute('data-user-id', info.event.extendedProps.user.id)
            info.el.setAttribute('data-event-id', eventId)
            info.el.appendChild(removeBtnEl)
            removeBtnEl.setAttribute('data-event-id', eventId)
            eventRemoveBtns.current.push(removeBtnEl)

            removeBtnEl.addEventListener('click', showDeleteModal)
          }}
          eventResize={info => handleEdit(info.event)}
          eventDrop={info => handleEdit(info.event)}
          eventClick={info => {
            if (!info.event.extendedProps.isNew && !props.allEditable) {
              return
            }
            setEditedEventId(info.event.extendedProps.eventId)
            toggleEventEditModal(true)
          }}
          editable={props.allEditable}
          timeZone={props.timeZone}
        />
      </CalendarStyled>
      {
        tempEvent && <EventModal
          isOpen={eventModalVisible}
          date={tempEvent.date}
          onRequestClose={() => toggleEventModal(false)}
          onSubmit={addEvent}
          users={props.users}
          allDay={tempEvent.allDay}
          title='Add Event'
          timeZone={props.timeZone}
        />
      }
      {
        editedEvent && <EventModal
          isOpen={eventEditModalVisible}
          date={editedEvent.start}
          onRequestClose={() => toggleEventEditModal(false)}
          onSubmit={({ userId, privateNote, publicNote, title }) => {
            props.onEdit({
              eventId: editedEvent.eventId,
              user: {
                id: userId
              },
              privateNote,
              publicNote,
              title
            })
            toggleEventEditModal(false)
          }}
          users={props.users}
          allDay={editedEvent.allDay}
          title='Edit Event'
          initialData={{
            userId: editedEvent.user.id,
            privateNote: editedEvent.privateNote,
            publicNote: editedEvent.publicNote,
            title: editedEvent.title
          }}
          timeZone={props.timeZone}
        />
      }
      <DateWarningModal
        isOpen={dateClickWarningVisible}
        onRequestClose={() => toggleDateClickWarning(false)}
      />
      <DeleteWarningModal
        isOpen={deleteModalVisible}
        onRequestClose={() => toggleDeleteModal(false)}
        onDelete={() => {
          props.onRemoveEvent(eventIdToRemove.current)
          toggleDeleteModal(false)
        }}
      />
    </>
  )
}

export default Calendar
