import { unsetNumberId } from '../../common/consts'
import SelectField from '../../common/formikFields/selectField'
import TextareaField from '../../common/formikFields/textareaField'
import styled from 'styled-components'
import { Field, Form, FormikProps, withFormik } from 'formik'
import * as React from 'react'

import { User, UserEventData } from './types'

const StyledButtons = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 10px;
  }
`

export interface CustomProps {
  users: User[]
  onSubmit: (values: UserEventData) => void
  onCancel: () => void
  initialData?: UserEventData
}

export type FormValues = UserEventData

type AddEventFormViewProps = FormikProps<FormValues> & CustomProps

const AddEventFormView: React.FunctionComponent<AddEventFormViewProps> = props => {
  return (
    <>
      <Form>
        <Field
          name={'userId'}
          component={SelectField}
          label='Assign user'
          options={props.users.map(p => ({
            label: `${p.firstName} ${p.lastName}`,
            value: p.id
          }))}
        />
        <Field name={'publicNote'} component={TextareaField} label='Public note' />
        <Field name={'privateNote'} component={TextareaField} label='Private note' />
        <StyledButtons>
          <button
            onClick={props.onCancel}
          >
            Cancel
          </button>
          <button
            type='submit'
          >
            Submit
          </button>
        </StyledButtons>
      </Form>
    </>
  )
}

const AddEventForm = withFormik<CustomProps, FormValues>({
  handleSubmit:  (values, { setSubmitting, props }) => {
    props.onSubmit(values)
    setSubmitting(false)
  },
  mapPropsToValues: props => ({
    userId: unsetNumberId,
    privateNote: '',
    publicNote: '',
    ...props.initialData
  })
})(AddEventFormView)

export default AddEventForm
