
import * as React from 'react'
import ReactDOM from 'react-dom';

import { ThemeProvider } from 'styled-components'
import theme from './common/theme'
import Calendar from './components/calendar/calendarContainer'

const AppContainer = () => (
  <ThemeProvider theme={theme}>
      <Calendar />
  </ThemeProvider>
)

const rootElement = document.getElementById('root')
ReactDOM.render(<AppContainer />, rootElement)
