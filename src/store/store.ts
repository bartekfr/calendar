import { configureStore, combineReducers } from '@reduxjs/toolkit'
import events from './events'

const rootReducer = combineReducers({
  events: events.reducer
})

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof rootReducer>

export default store
