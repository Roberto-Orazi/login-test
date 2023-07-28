import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import { styled, Button } from '@mui/material'
import { clearCredentials } from '../../utils/credentials.helper'
import { useHistory, useLocation } from 'react-router-dom'
import { User } from '../../types/types'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import createValidator from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { RQueryKeys } from '../../types/react-query'
import { UserForm } from '../shared/Form'
import { FormikHelpers } from 'formik'

interface Location {
  mode: string;
  data?: User;
}
type Values = CreateUser | UpdateUser

const createInitialValues: CreateUser = {
  fullName: '',
  email: '',
  password: '',
}

export const Dashboard = () => {
  const queryClient = useQueryClient()

  const USERS_QUERY_KEY = 'users'

  const [editModalOpen, setEditModalOpen] = useState(false)

  const history = useHistory()

  const location = useLocation<Location>()
  const { data } = location.state || {}
  const [mode, setMode] = useState<'add' | 'update'>('add')

  const [users, setUsers] = useState<User[]>([])
  const [initialValues, setInitialValues] = useState<Values>(createInitialValues)

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
    setInitialValues(createInitialValues)
    setEditModalOpen(true)
  }

  const handleEdit = (id: string) => {
    const user = users.find((user) => user.id === id)
    if (user) {
      setMode('update')
      setEditModalOpen(true)
      setInitialValues({
        id,
        fullName: user.fullName,
        email: user.email,
      } as UpdateUser)
    }
  }

  const onSubmit = async (values: Values, formik: FormikHelpers<Values>) => {
    console.log('Form values:', values)

    if (mode === 'add') {
      await createMutation.mutateAsync(values as CreateUser)
    } else if (mode === 'update') {
      await updateMutation.mutateAsync(values as UpdateUser)
    }

    formik.resetForm()
  }
  useEffect(() => {
    if (mode === 'add') setMode('add')
    else if (mode === 'update') setMode('update')
    if (mode === 'update' && data) {
      setInitialValues({
        ...data
      })
    }
  }, [mode, data])

  const onSuccess = () => {
    queryClient.invalidateQueries(RQueryKeys.email)
    setEditModalOpen(false)
    queryClient.invalidateQueries(USERS_QUERY_KEY)
  }

  const onError = (error: any, action: 'create' | 'update') => {
    console.error(`Error while ${action === 'create' ? 'creating' : 'updating'} user:`, error)
  }

  const createMutation = useMutation(UserService.create, {
    onSuccess,
    onError: (error) => onError(error, 'create'),
    onSettled: () => queryClient.invalidateQueries(USERS_QUERY_KEY),
  })

  const updateMutation = useMutation<User, unknown, UpdateUser>(
    (dto) => UserService.update(data?.id || '', dto),
    {
      onSuccess,
      onError: (error) => onError(error, 'update'),
      onSettled: () => queryClient.invalidateQueries(USERS_QUERY_KEY),
    }
  )

  const validate = mode === 'add'
    ? createValidator(CreateUser)
    : createValidator(UpdateUser)

  const isLoading = createMutation.isLoading || updateMutation.isLoading

  const handleClose = () => {
    setEditModalOpen(false)
  }


  useEffect(() => {
    if (usersData) {
      setUsers(usersData)
    }
  }, [usersData])

  const logout = () => {
    clearCredentials()
    history.replace('/')
  }

  useEffect(() => {
    UserService.list()
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => {
        console.error('Error fetching users from the backend:', error)
      })
  }, [])

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
      <UserForm
        open={editModalOpen}
        onClose={handleClose}
        initialValues={initialValues}
        mode={mode}
        onSubmit={onSubmit}
        validate={validate}
        isLoading={isLoading}
      />
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


