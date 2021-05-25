import { configureStore, combineReducers } from '@reduxjs/toolkit'
import events from './events'
import users from './users'

const rootReducer = combineReducers({
  events: events.reducer,
  users: users.reducer
})

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof rootReducer>

export default store
