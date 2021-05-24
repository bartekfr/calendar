import styled from 'styled-components'

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

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  margin: 0 10px 0 0;
  padding: 5px 15px;
  line-height: 30px;
  border: 2px solid ${props => props.theme.colors.BORDER};
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity .5s;
  font-weight: 500;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    opacity: 0.8;
  }

  &[type="submit"] {
    background-color: ${props => props.theme.colors.SUCCESS};
    color: #fff;
  }
`