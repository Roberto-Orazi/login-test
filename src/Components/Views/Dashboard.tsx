import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridCellEditStopParams, GridCellParams } from '@mui/x-data-grid'
import { Formik, FormikHelpers } from 'formik'
import { Modal, TextField, Button, styled } from '@mui/material'
import { clearCredentials } from '../../utils/credentials.helper'
import { useHistory } from 'react-router-dom'
import { User } from '../../types/types'

export const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([])
  const [editedUsers, setEditedUsers] = useState<{ [id: string]: User }>({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [addUser, setAddUser] = useState<User | null>(null)
  const history = useHistory()

  const logout = () => {
    clearCredentials()
    history.replace('/')
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {}
    // Add validation rules for each field if needed
    if (!values.fullName) {
      errors.fullName = 'Full Name is required'
    }
    if (!values.email) {
      errors.email = 'Email is required'
    }
    if (!values.password) {
      errors.password = 'Password is required'
    }
    return errors
  }

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
      console.error('Error fetching user data:', error)
    }
  }
  interface FormValues {
    fullName: string;
    email: string;
    password: string;
  }

  const initialValues: FormValues = {
    fullName: '',
    email: '',
    password: '',
  }
  const handleCellEditStop = (params: GridCellEditStopParams) => {
    const { id, field, value } = params
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [id]: { ...prevEditedUsers[id], [field]: value },
    }))
  }

  const handleAddUser = () => {
    setAddUser({ id: '', fullName: '', email: '', password: '' })
    setEditModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDelete = async (user: User) => {
    try {
      const token = '...'
      await fetch(`http://localhost:5005/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchUsers()
    } catch (error) {
      console.error('Error deleting the user:', error)
    }
  }

  const handleEditModalClose = () => {
    setSelectedUser(null)
    setEditModalOpen(false)
  }

  const handleEditModalSave = async (values: Values, formik: FormikHelpers<Values>) => {
    try {
      if (selectedUser) {
        const updatedUser = {
          ...selectedUser,
          ...editedUsers[selectedUser.id],
        }
        await fetch(`http://localhost:5005/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        })
        fetchUsers()
        handleEditModalClose()
      } else {
        formik.resetForm()
      }
    } catch (error) {
      console.error('Error saving changes:', error)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [selectedUser!.id]: {
        ...selectedUser!,
        [name]: value,
      },
    }))
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
      width: 160,
      renderCell: (params: GridCellParams) => (
        <Box sx={{
          display: 'flex',
          gap: '1rem'
        }}>
          <ButtonEdit onClick={() => handleEdit(params.row)}>Edit</ButtonEdit>
          <ButtonDelete onClick={() => handleDelete(params.row)}>Del</ButtonDelete>
        </Box>
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
        disableSelectionOnClick
        isCellEditable={(params) => params.row.id !== ''}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
        <ButtonLogout variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </ButtonLogout>
        <ButtonLogout variant="contained" color="primary" onClick={logout}>
          Logout
        </ButtonLogout>
      </Box>
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <Formik
          enableReinitialize
          initialValues={selectedUser || addUser || initialValues}
          onSubmit={handleEditModalSave}
          validate={validate}
        >
          {({ handleSubmit }) => (
            <StyledModalBox>
              <h2>{selectedUser ? 'Edit User' : 'Add User'}</h2>
              {selectedUser || addUser ? (
                <>
                  <TextField
                    name="fullName"
                    label="Full Name"
                    required
                    onChange={handleInputChange}
                    value={selectedUser ? selectedUser.fullName : ''}
                  />
                  <TextField
                    name="email"
                    label="Email"
                    required
                    onChange={handleInputChange}
                    value={selectedUser ? selectedUser.email : ''}
                  />
                  <TextField
                    name="password"
                    label="Password"
                    required
                    onChange={handleInputChange}
                    value={selectedUser ? selectedUser.password : ''}
                  />
                  <Button onClick={handleSubmit}>Save</Button>
                  <Button onClick={handleEditModalClose}>Cancel</Button>
                </>
              ) : null}
            </StyledModalBox>
          )}
        </Formik>
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
  background-color: #7f9280;
  color: #000000;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 4px;
  text-transform: none;
`

const ButtonDelete = styled(Button)`
  background-color: #e42b2b;
  color: #000000;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 4px;
  text-transform: none;
`

const StyledModalBox = styled(Box)`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`
