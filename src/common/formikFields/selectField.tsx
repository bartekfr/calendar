import { FieldProps, getIn } from 'formik'
import * as React from 'react'
import ReactSelect, { components } from 'react-select'
import { ValueContainerProps } from 'react-select/lib/components/containers'
import { FocusEventHandler } from 'react-select/lib/types'
import styled from 'styled-components'
import { fieldBottomMargin, Label, ValidationError } from './styled'

export const StyledSelectWrapper = styled.div<{ error?: boolean, compactMode?: boolean }>`
  position: relative;
  min-width: 200px;
  font-size: 13px;

  ${ValidationError} {
    bottom: -18px;
  }

  && > div {
    width: 100%;
    box-shadow: none;
    margin-bottom: ${props => props.compactMode ? '5px' : fieldBottomMargin};

    & > div  {
      border-width: 2px;
      min-height: 32px;
      ${props => props.error && `border-color ${props.theme.colors.ALERT};`}
    }

    & > div:first-of-type  {
      box-shadow: none;
    }
  }
`

const IndicatorSeparator = () => (null)

const StyledValue = styled(components.ValueContainer)`
  padding-left: 40px;
  cursor: text;
`
const ValueContainer = (props: ValueContainerProps<any> & { isSearchable?: boolean }) => {
  const { isSearchable, ...valueProps } = props
  if (isSearchable) {
    return (
      <StyledValue {...valueProps} >
        <>
          {props.children}
        </>
      </StyledValue>
    )
  } else {
    return (
      <components.ValueContainer {...valueProps} />
    )
  }
}

export interface OptionValue<T = string | number, K = string> {
  customData?: K
  label: string
  value: T
  options?: Array<OptionValue<T, K>>
}

interface SelectCustomProps<T, K> {
  options: Array<OptionValue<T, K>>
  label?: string
  className?: string
  isSearchable?: boolean
}

type SingleSelectedType<T, K> = OptionValue<T, K> | undefined | null
// below type needed because of react-select type bug
// https://github.com/JedWatson/react-select/issues/2902
type SelectedType<T, K> = Array<OptionValue<T, K>> | SingleSelectedType<T, K>

// Type-guard that determines whether single options is selected
export function isSelectedSingleValue<T, K> (val: SelectedType<T, K>): val is OptionValue<T, K> {
  return !Array.isArray(val) && ((val as OptionValue<T, K>).value !== undefined)
}

interface SelectProps<T, K> extends SelectCustomProps<T, K> {
  name?: string
  value?: T
  placeholder?: string
  onChange: (selected: SingleSelectedType<T, K>) => void
  components?: Partial<typeof components>
  error?: string
  onBlur?: FocusEventHandler
  compactMode?: boolean
}

export class Select<T = string, K = string> extends React.Component<SelectProps<T, K>> {
  render () {
    const { className, error, name, label, onBlur, onChange, options, value, ...props } = this.props

    // if `value` prop is not passed it means component is used as 'uncontrolled' and react-select should
    // handle value changes on its own. In such case react-select 'value' prop must be 'undefined'
    const selectValue = typeof value !== 'undefined' ? options.find(o => o.value === value) : undefined
    const compactMode = props.compactMode === undefined ? !label : props.compactMode

    return (
      <StyledSelectWrapper className={className} error={!!error} compactMode={compactMode}>
        {label && <Label htmlFor={name} error={!!error}>{label}</Label>}
        <ReactSelect
          {...props}
          isMulti={false}
          value={selectValue}
          options={options}
          onChange={(selected: SelectedType<T, K>) => {
            // TODO: in case multiple options selection is needed this handler have to be extended
            onChange(selected && isSelectedSingleValue(selected) ? selected : null)
          }}
          isSearchable={props.isSearchable}
          components={{
            IndicatorSeparator,
            ValueContainer: (valueProps: ValueContainerProps<any>) => (
              <ValueContainer {...valueProps} isSearchable={props.isSearchable} />
            ),
            ...props.components
          }}
          onBlur={onBlur}
        />
        <ValidationError show={!!error && !compactMode}>{error}</ValidationError>
      </StyledSelectWrapper>
    )
  }
}

export function isString (val: string | any): val is string {
  return typeof val === 'string'
}

type FormikSelectProps<T, K> = FieldProps & SelectCustomProps<T, K>

class FormikSelect<T = string, K = string> extends React.Component<FormikSelectProps<T, K>> {
  render () {
    const { field, form, ...props } = this.props
    const value = typeof field.value !== 'undefined' ? field.value : null
    const errorMsg = getIn(form.errors, field.name)
    const error = !!errorMsg
    const touched = getIn(form.touched, field.name)
    const showError = error && (touched || form.submitCount)

    return (
      <>
        <Select
          {...props}
          error={showError && isString(errorMsg) ? errorMsg : ''}
          value={value}
          name={field.name}
          options={props.options}
          onBlur={() => form.setFieldTouched(field.name)}
          onChange={selected => {
            form.setFieldValue(field.name, selected ? selected.value : null)
            form.validateField(field.name)
            form.setFieldTouched(field.name)
          }}
        />
      </>
    )
  }
}

export default FormikSelect
