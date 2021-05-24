
import * as React from 'react'
import ReactDOM from 'react-dom';
import { ToastProvider } from 'react-toast-notifications';

import { ThemeProvider } from 'styled-components'
import theme from './common/theme'
import Calendar from './components/calendar/calendarContainer'
import { GlobalStyles } from './common/styled'

const AppContainer = () => (
  <ThemeProvider theme={theme}>
      <ToastProvider>
        <Calendar />
      </ToastProvider>
      <GlobalStyles />
  </ThemeProvider>
)

const rootElement = document.getElementById('root')
ReactDOM.render(<AppContainer />, rootElement)
