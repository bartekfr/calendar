import React from 'react'
import Calendar from './calendarExtended'
import { assignUsersColorsToEvents, initializeUsersData } from './helpers'
import { mockUsers } from './mockData'

import { useAppSelector, useAppDispatch } from '../../common/hooks'
import eventsSlice, { loadEvents } from '../../store/events'



const AffiliateCalendarContainer: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const events = useAppSelector(state => state.events.list)

  const usersWithColors = initializeUsersData(mockUsers)


  React.useEffect(() => {
    dispatch(loadEvents())
  }, [dispatch])

  const eventsWithColors = React.useMemo(() => assignUsersColorsToEvents(events, usersWithColors), [events, usersWithColors])

  return (
    <>
      {
        eventsWithColors.length > 0 && usersWithColors.length > 0 && <Calendar
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

export default AffiliateCalendarContainer
