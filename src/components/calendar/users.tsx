import styled from 'styled-components'
import * as React from 'react'
import { Button } from './styled'
import { CalendarUser, EventData } from './types'

const Wrapper = styled.div`
  display: flex;
  padding: 0 0 20px 0;
  flex-wrap: wrap;

  p {
    width: 100%;
    padding: 5px 0 10px 0;
    font-size: 14px;
  }

  Button {
    margin-right: 10px;
  }
`

const Item = styled(Button)<{
  active: boolean
  color: string
}>`
  background-color: ${props => props.active ? props.color : '#fff'};
  border-color: ${props => props.active ? props.color : props.theme.colors.GREEN};
  color: ${props => props.active ? '#fff' : props.theme.colors.BORDER};
`

interface UsersProps {
  users: CalendarUser[]
  setUsers: (users: CalendarUser[]) => void
}

const Users: React.FunctionComponent<UsersProps> = props => {
  const { users, setUsers } = props

  const toggle = (id: EventData['user']['id']) => {
    const updatedUsers = users.map(p => {
      if (p.id === id) {
        return {
          ...p,
          checked: !p.checked
        }
      } else {
        return p
      }
    })

    setUsers(updatedUsers)
  }

  const toggleAll = (selected: boolean) => {
    const updatedUsers = users.map(p => ({
      ...p,
      checked: selected
    }))

    setUsers(updatedUsers)
  }
  const allSelected = React.useMemo(() => users.every(p => !!p.checked), [users])
  const allDeselected = React.useMemo(() => users.every(p => !p.checked), [users])

  return (
    <Wrapper>
      <Button
        onClick={() => toggleAll(true)}
        disabled={allSelected}
      >
        Select all
      </Button>
      <Button
        onClick={() => toggleAll(false)}
        disabled={allDeselected}
      >
        Deselect all
      </Button>
      {
        users.map(p => (
          <Item
            key={p.id}
            onClick={() => toggle(p.id)}
            color={p.color}
            active={!!p.checked}
          >
            {`${p.firstName} ${p.lastName}`}
          </Item>
        ))
      }
    </Wrapper>
  )
}

export default Users
