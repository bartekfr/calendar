
import * as React from 'react'
import ReactDOM from 'react-dom';
import { ToastProvider } from 'react-toast-notifications';

import { Provider } from 'react-redux'
import store from './store/store'

import { ThemeProvider } from 'styled-components'
import theme from './common/theme'
import Calendar from './components/calendar/calendarContainer'
import { GlobalStyles } from './common/styled'

const AppContainer = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
        <ToastProvider>
          <Calendar />
        </ToastProvider>
        <GlobalStyles />
    </ThemeProvider>
  </Provider>
)

const rootElement = document.getElementById('root')
ReactDOM.render(<AppContainer />, rootElement)
