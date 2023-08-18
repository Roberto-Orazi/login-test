import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import { styled, Button } from '@mui/material'
import { clearCredentials } from '../../utils/credentials.helper'
import { useHistory } from 'react-router-dom'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { UserService } from '../../services/basics/user.service'
import { ELinks } from '../navigation/navigation.types'


const USERS_QUERY_KEY = 'users'

export const Dashboard = () => {
  const queryClient = useQueryClient()
  const history = useHistory()

  const { data: usersData } = useQuery(USERS_QUERY_KEY, UserService.list)

  const handleDeleteUser = useMutation(
    (id: string) => UserService.deleteUser(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USERS_QUERY_KEY)
      },
      onError: (error) => {
        console.error('Error deleting user:', error)
      },
    }
  )

  const handleDeleteUserClick = async (id: string) => {
    try {
      await handleDeleteUser.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleAddUser = () => {
    history.push({
      pathname: ELinks.addUser,
    })
  }

  const handleEdit = (id: string) => {
    const user = usersData?.find((user) => user.id === id)
    if (user) {
      console.log(user)
      history.push({
        pathname: ELinks.editUser + '/' + id,
        state: { initialValues: user }
      })
    }
  }

  const logout = () => {
    clearCredentials()
    history.replace({
      pathname: ELinks.login
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
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: (params: GridCellParams) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <ButtonEdit onClick={() => handleEdit(params.row.id)}>Edit</ButtonEdit>
          <ButtonDelete onClick={() => handleDeleteUserClick(params.row.id)}>Del</ButtonDelete>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={usersData || []}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
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
  &:hover {
    background-color: #db3a3a;
  }
`