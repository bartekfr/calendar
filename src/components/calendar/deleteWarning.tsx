import Modal from '../../common/modal'
import styled from 'styled-components'
import * as React from 'react'
import { Button } from './styled'

const ModalContent = styled.div`
  p {
    font-size: 15px;
    color: ${props => props.theme.colors.BORDER};
    margin-bottom: 20px;
  }

  strong {
    font-weight: 500;
  }

  div {
    display: flex;
    justify-content: flex-end;

    button {
      margin-left: 8px;
    }
  }
`

interface DateClickWarningProps {
  onRequestClose: () => void
  onDelete: () => void
  isOpen: boolean
}

const DateClickWarning: React.FunctionComponent<DateClickWarningProps> = props => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onRequestClose}
        title='Delete Confirmation'
        colorTheme='ALERT'
        background='LIGHT'
        centerVertically={true}
        showBorderRadius={false}
      >
      <ModalContent>
        <p>
          Are you sure you want to delete this event?
        </p>
        <div>
          <Button
            onClick={props.onRequestClose}
            type='button'
          >
            Cancel
          </Button>
          <Button
            onClick={() => props.onDelete()}
            type='button'
          >
            Delete
          </Button>
        </div>
      </ModalContent>
      </Modal>
    </>
  )
}

export default DateClickWarning
