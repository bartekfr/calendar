import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { mockEvents } from '../components/calendar/mockData'
import { EventDelta, RawEventData } from '../components/calendar/types'

export interface EventsState {
  list: RawEventData[]
  loading?: boolean
}

export const loadEvents = createAsyncThunk(
  'events/list',
  async () => {
    // just simulate async request
    await fetch(`https://jsonplaceholder.typicode.com/todos`)
    console.log('response')
    return mockEvents as RawEventData[]
  }
)

const events = createSlice({
  name: 'events',
  initialState: {
    list: []
  } as EventsState,
  reducers: {
    add: (state, action: PayloadAction<RawEventData>) => {
      state.list.push(action.payload)
    },
    delete: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((ev) => ev.eventId !== action.payload)
    },
    edit: (state, action: PayloadAction<EventDelta>) => {
      const updatedEvents = state.list.map(e => {
        if (e.eventId === action.payload.eventId) {
          return {
            ...e,
            ...action.payload
          }
        } else {
          return e
        }
      })

      state.list = updatedEvents
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.list = action.payload
        state.loading = false
      })
  }
})

export default events
