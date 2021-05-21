import * as React from 'react'
import Modal from './modal'
import styled from 'styled-components'

const ModalContent = styled.div`
  p {
    font-size: 15px;
    color: ${props => props.theme.colors.GREY};
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

type ToggleModal = () => void
interface DeleteConfirmationProps {
  message: JSX.Element | string
  onConfirm: () => void
  children: (toggleConfirmationModal: ToggleModal) => React.ReactNode // render prop pattern
}

interface DeleteConfirmationState {
  showDeleteConfirmation: boolean
}

class DeleteConfirmation extends React.Component<DeleteConfirmationProps, DeleteConfirmationState> {
  state: DeleteConfirmationState = {
    showDeleteConfirmation: false
  }

  toggleDeleteConfirmation = () => {
    this.setState(prev => ({
      showDeleteConfirmation: !prev.showDeleteConfirmation
    }))
  }

  handleDelete = () => {
    this.toggleDeleteConfirmation()
    this.props.onConfirm()
  }

  render () {
    return (
      <>
        {/* render prop pattern */}
        {this.props.children(this.toggleDeleteConfirmation)}
        <Modal
          isOpen={this.state.showDeleteConfirmation}
          onRequestClose={this.toggleDeleteConfirmation}
          title='Delete confirmation'
          centerVertically={true}
          colorTheme='ALERT'
          background='LIGHT'
          showBorderRadius={false}
        >
          <ModalContent>
            <p>
              {this.props.message}
            </p>
            <div>
              <button
                onClick={this.toggleDeleteConfirmation}
              >
                Cancel
              </button>
              <button
                onClick={() => this.handleDelete()}
              >
                Delete
              </button>
            </div>
          </ModalContent>
        </Modal>
      </>
    )
  }
}

export default DeleteConfirmation
