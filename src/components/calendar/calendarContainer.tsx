import React from 'react'
import Calendar from './calendarExtended'
import { assignUsersColorsToEvents, initializeUsersData } from './helpers'

import { useAppSelector, useAppDispatch } from '../../common/hooks'
import eventsSlice, { loadEvents } from '../../store/events'
import { loadUsers } from '../../store/users'



const CalendarContainer: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const events = useAppSelector(state => state.events.list)
  const users = useAppSelector(state => state.users.list)
  const eventsLoading = useAppSelector(state => state.events.loading)
  const usersLoading = useAppSelector(state => state.users.loading)

  const usersWithColors = initializeUsersData(users)


  React.useEffect(() => {
    dispatch(loadEvents())
    dispatch(loadUsers())
  }, [dispatch])

  const eventsWithColors = React.useMemo(() => assignUsersColorsToEvents(events, usersWithColors), [events, usersWithColors])

  return (
    <>
      {
        !eventsLoading && !usersLoading && <Calendar
          events={eventsWithColors}
          users={usersWithColors}
          addingMultipleEvents
          onAddEvent={values => console.log('Add event', values)}
          onEditEvent={values => console.log('Edit event', values)}
          onRemoveEvent={id =>eventsSlice.actions.delete(id)}
          onSettingsUpdate={values => console.log('Settings update', values)}
          allEditable
        />
      }
    </>
  )
}

export default CalendarContainer
