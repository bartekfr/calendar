import React from 'react'
import Calendar from './calendarExtended'
import { assignUsersColorsToEvents, initializeUsersData } from './helpers'
import { mockEvents, mockUsers } from './mockData'
const mockColorUsers = initializeUsersData(mockUsers)
const mockEventsWithColors = assignUsersColorsToEvents(mockEvents, mockColorUsers)

const AffiliateCalendarContainer: React.FunctionComponent = () => {

  return (
    <Calendar
      events={mockEventsWithColors}
      users={mockColorUsers}
      addingMultipleEvents
      onAddEvent={values => console.log('Add event', values)}
      onEditEvent={values => console.log('Edit event', values)}
      onRemoveEvent={id => console.log('Remove event', id)}
      onSettingsUpdate={values => console.log('Settings update', values)}
      allEditable
    />
  )
}

export default AffiliateCalendarContainer
