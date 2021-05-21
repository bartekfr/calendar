import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import styled from 'styled-components'
import { Label, ValidationError } from './styled'

export type LabelBarComponentPosition = 'left' | 'right'

const StyledTextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  ${Label} {
    white-space: unset;
  }

  ${ValidationError} {
    bottom: 7px;
  }
`

const StyledLabelBar = styled.div<{componentPosition?: LabelBarComponentPosition}> `
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: ${props => props.componentPosition === 'right' ? 'space-between' : 'flex-start'}
`

const StyledLabel = styled(Label) `
  width: unset;
  flex: unset;
  margin-right: 20px;
`

const StyledTextarea = styled.textarea<{ error?: boolean }>`
  margin-bottom: 25px;
  border-radius: 5px;
  border: 2px solid ${props => props.error ? props.theme.colors.ALERT : props.theme.colors.GREY};
  font-size: 13px;
  flex-basis: fill;
  flex: 1 1;
  box-sizing: border-box;
  padding: 12px;
  min-height: 115px;
  resize: vertical;

  &:focus {
    border-color: ${props => props.theme.colors.GREEN};
    outline: none;
  }
`

interface CustomProps {
  label?: string
  rows?: number
  // allows wrapping component in styled-component to override styles if needed
  className?: string
  labelBarComponent?: React.ReactNode
  labelBarComponentPosition?: LabelBarComponentPosition
  compactMode?: boolean
}

type FormikTextareaProps = FieldProps & CustomProps
const FormikTextarea: React.FunctionComponent<FormikTextareaProps> = ({
  field,
  form,
  ...props
}) => {
  const error = getIn(form.errors, field.name)
  const touched = getIn(form.touched, field.name)
  const showError = error && (touched || form.submitCount)
  const compactMode = props.compactMode === undefined ? !props.label : props.compactMode

  return (
    <StyledTextareaWrapper className={props.className}>
      <StyledLabelBar componentPosition={props.labelBarComponentPosition}>
        {props.label && <StyledLabel htmlFor={field.name} error={showError}>{props.label}</StyledLabel>}
        {props.labelBarComponent}
      </StyledLabelBar>
      <StyledTextarea {...field} {...props} id={field.name} rows={props.rows} error={showError} />
      <ValidationError show={showError && !compactMode}>{form.errors[field.name]}</ValidationError>
    </StyledTextareaWrapper>
  )
}

FormikTextarea.defaultProps = {
  labelBarComponentPosition: 'right',
  rows: 5
}

export default FormikTextarea
