import styled, { createGlobalStyle } from 'styled-components'

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid ${props => props.theme.colors.BORDER};

  > :last-child {
    align-self: flex-start;
  }

  button {

  }
`

export const Wrapper = styled.section`
`

export const ToolbarBottom = styled.div`
  display: inline-flex;
  flex: 0 0 500px;
  align-items: flex-end;
  position: relative;
  z-index: 100;

  > div:first-child {
    margin-right: 15px;
  }

  button {
    margin: 0 0 15px 15px;
  }

  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_XL}) {
    margin-bottom: -50px;
  }
`

export const GlobalFullScreenStyle = createGlobalStyle`
  #app {
    overflow-y: auto;

    header {
      display: none;
    }

    > section:first-of-type {
      display: none;
    }

    > section:last-child {
      margin :0;

      > div > div:first-child {
        display: none;
      }
    }

    ${Wrapper} {
      margin: 0 -15px;
    }
  }
`

export const FullScreenBtn = styled.div`
  cursor: pointer;
  align-self: flex-start;
`
