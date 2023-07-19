import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridCellEditStopParams, GridCellParams } from '@mui/x-data-grid'
import { Button, styled, Modal, TextField } from '@mui/material'
import { clearCredentials } from '../../utils/credentials.helper'
import { useHistory } from 'react-router-dom'
import { User } from '../../types/types'


export const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([])
  const [editedUsers, setEditedUsers] = useState<{ [id: string]: User }>({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const history = useHistory()

  const logout = () => {
    clearCredentials()
    history.replace('/')
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = '...'
      const response = await fetch('http://localhost:5005/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error trayendo los datos de usuario:', error)
    }
  }

  const handleCellEditStop = (params: GridCellEditStopParams) => {
    const { id, field, value } = params
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [id]: { ...prevEditedUsers[id], [field]: value },
    }))
  }

  const handleSaveChanges = async () => {
    try {
      const request = Object.entries(editedUsers).map(([id, updatedUser]) =>
        fetch(`http://localhost:5005/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        })
      )
      await Promise.all(request)
      fetchUsers()
      setEditedUsers({})
    } catch (error) {
      console.error('Error guardando los cambios:', error)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setSelectedUser(null)
    setEditModalOpen(false)
  }

  const handleEditModalSave = () => {
    handleEditModalClose()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSelectedUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          [name]: value,
        }
      }
      return prevUser
    })
  }
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'fullName',
      headerName: 'Full name',
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      editable: true,
    },
    {
      field: 'password',
      headerName: 'Password',
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <ButtonEdit onClick={() => handleEdit(params.row)}>Edit</ButtonEdit>
      ),
    },
  ]
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        onCellEditStop={handleCellEditStop}
        checkboxSelection
        disableRowSelectionOnClick
        isCellEditable={(params) => params.row.id !== ''}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <ButtonLogout variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Changes
        </ButtonLogout>
        <ButtonLogout onClick={() => logout()}>Logout</ButtonLogout>
      </Box>

      {/* Edit User Modal */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <div className="modal-content">
          <h2>Edit User</h2>
          {selectedUser && (
            <>
              <TextField
                name="fullName"
                label="Full Name"
                value={selectedUser.fullName}
                onChange={handleInputChange}
              />
              <TextField
                name="email"
                label="Email"
                value={selectedUser.email}
                onChange={handleInputChange}
              />
              <TextField
                name="password"
                label="Password"
                value={selectedUser.password}
                onChange={handleInputChange}
              />
              <Button onClick={handleEditModalSave}>Save</Button>
              <Button onClick={handleEditModalClose}>Cancel</Button>
            </>
          )}
        </div>
      </Modal>
    </Box>
  )
}

const ButtonLogout = styled(Button)`
  background-color: #7d7d7d;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #939292;
  }
`

const ButtonEdit = styled(Button)`
  background-color: #2e7d32;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 4px;
  text-transform: none;
`