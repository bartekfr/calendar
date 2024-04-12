import { FieldProps, getIn } from 'formik'
import * as React from 'react'

import styled from 'styled-components'
import { fieldBottomMargin, Label, ValidationError } from './styled'

const StyledInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`

const FakeInput = styled.div<{focus: boolean, error?: boolean, compactMode?: boolean }>`
  margin-bottom: ${props => props.compactMode ? '5px' : fieldBottomMargin};
  border-radius: 5px;
  border: 2px solid ${props => props.error ? props.theme.colors.ALERT : props.theme.colors.GREY};
  font-size: 13px;
  box-sizing: border-box;
  height: 32px;
  width: 100%;
  background-color: white;
  display: flex;
  ${props => (
    props.focus && `
      border-color: ${props.theme.colors.GREEN};
      outline: none;
    `
  )}
`

export const StyledInput = styled.input`
  padding: 0 10px;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  flex-basis: fill;
  flex: 1 1;
`

interface CustomProps {
  className?: string
  label?: string
  compactMode?: boolean // in compactMode field doesn't display error message and its bottom margin is smaller
}

interface FormikInputState {
  focus: boolean
}

type FormikInputProps = FieldProps & CustomProps
class FormikInput extends React.PureComponent<FormikInputProps, FormikInputState> {
  state = {
    focus: false
  }
  render () {
    const {
      className,
      field, // { name, value, onChange, onBlur }
      form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
      ...props
    } = this.props
    /*
      Make sure default value is always set to avoid
      "A component is changing an uncontrolled input to be controlled" error
      Empty string is correct value even for number inputs:
      https://github.com/facebook/react/issues/7779#issuecomment-248432471
    */
    const value = typeof field.value === 'undefined' ? '' : field.value
    const error = getIn(form.errors, field.name)
    const touched = getIn(form.touched, field.name)
    // It can be assumed that if there is no label, the field is displayed in filters form so it should
    // be displayed in compactMode. The are only few exceptions to this rule.
    const compactMode = props.compactMode === undefined ? !props.label : props.compactMode
    const showError = error && (touched || form.submitCount)

    return (
      <StyledInputWrapper className={className} >
        {props.label && <Label htmlFor={field.name} error={showError}>{props.label}</Label>}
        <FakeInput focus={this.state.focus} error={showError} compactMode={compactMode}>
          <StyledInput
            {...field}
            {...props}
            id={field.name}
            value={value}
            onFocus={() => { this.setState({ focus: true }) }}
            onBlur={e => {
              form.handleBlur(e)
              this.setState({ focus: false })
            }}
          />
          <ValidationError show={showError && !compactMode}>{error}</ValidationError>
        </FakeInput>
      </StyledInputWrapper>
    )
  }
}

export default FormikInput
