import Modal from '../../common/modal'
import styled from 'styled-components'
import moment from 'moment-timezone'
import * as React from 'react'
import Form, { CustomProps } from './addEventForm'
import { UserEventData } from './types'

const ModalContent = styled.div`
`

const StyledTime = styled.time`
  margin: 20px 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 20px;

  svg {
    margin-right: 10px;
    color: ${props => props.theme.colors.BORDER}
  }
`

interface EventModalProps {
  onRequestClose: () => void
  isOpen: boolean
  onSubmit: CustomProps['onSubmit']
  date: Date | string
  users: CustomProps['users']
  allDay: boolean
  title: string
  initialData?: UserEventData
  timeZone: string
}

const EventModal: React.FunctionComponent<EventModalProps> = props => {
  const eventDate = props.timeZone === 'local' ? moment(props.date) : moment(props.date).tz(props.timeZone)
  const dateFormat = props.allDay ? 'MM/DD/YYYY' : 'MM/DD/YYYY HH:mm'
  const formattedDateStr = eventDate && eventDate.format(dateFormat)
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title={props.title}
        background='DARK'
        fullSide
      >
        <ModalContent>
          <StyledTime dateTime={formattedDateStr}>{formattedDateStr}</StyledTime>
          <Form
            onCancel={props.onRequestClose}
            onSubmit={props.onSubmit}
            users={props.users}
            initialData={props.initialData}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default EventModal
