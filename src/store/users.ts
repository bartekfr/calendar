import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { mockUsers } from '../components/calendar/mockData'
import { User } from '../components/calendar/types'

export interface EventsState {
  list: User[]
  loading?: boolean
}

export const loadUsers = createAsyncThunk(
  'users/list',
  async () => {
    // just simulate async request
    await fetch(`https://jsonplaceholder.typicode.com/todos`)
    return mockUsers as User[]
  }
)

const events = createSlice({
  name: 'events',
  initialState: {
    list: []
  } as EventsState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.list = action.payload
        state.loading = false
      })
  }
})

export default events
