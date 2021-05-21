
import 'styled-components';
import { themeColors } from './colors'
import * as mediaBreakpoints from './mediaBreakpoints'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof themeColors
    breakpoints: typeof mediaBreakpoints
  }
}
