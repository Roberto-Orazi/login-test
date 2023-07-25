import * as React from 'react'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef, GridCellEditStopParams, GridCellParams } from '@mui/x-data-grid'
import { Modal, TextField, IconButton, styled, Button, CircularProgress, Stack } from '@mui/material'
import { clearCredentials } from '../../utils/credentials.helper'
import { useHistory, useLocation } from 'react-router-dom'
import { User } from '../../types/types'
import { Formik, Field, FormikHelpers } from 'formik'
import { getFormikProps } from '@/utils/formik.helper'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { useMutation, useQueryClient } from 'react-query'
import createValidator from '@/utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { RQueryKeys } from '@/types/react-query'

interface Location {
  mode: string,
  data?: User
}
type Values = CreateUser | UpdateUser

const createInitialValues: CreateUser = {
  fullName: '',
  email: '',
  password: ''
}

export const Dashboard = () => {

  const history = useHistory()
  const location = useLocation<Location>()
  const {data, mode = 'add'} = location.state

  const [title, setTitle] = useState('Add Bar')
  const [initialValues, setInitialValues] = useState<Values>(createInitialValues)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (mode === 'add') setTitle('Add User')
    else if (mode === 'update') setTitle('Edit User')
    if (mode === 'update' && data){
      setInitialValues({
        ...data
      })
    }
  }, [mode, data])

  const onSuccess = () => {queryClient.invalidateQueries(RQueryKeys.email)}
  const createMutation = useMutation(UserService.create, {onSuccess})
  const updateMutation = useMutation(UserService.update, {onSuccess})

  const onSubmit = async (values: Values, formik: FormikHelpers<Values>) =>{
    if (mode === 'add'){
      await createMutation.mutateAsync(values as CreateUser)
    } else {
      await updateMutation.mutateAsync(values as UpdateUser)
    }
    formik.resetForm()
  }

  const validate = mode === 'add'
    ? createValidator(CreateUser)
    : createValidator(UpdateUser)

  const isLoading = createMutation.isLoading || updateMutation.isLoading

  const logout = () => {
    clearCredentials()
    history.replace('/')
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
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <Formik
         enableReinitialize
         initialValues={initialValues}
         onSubmit={onSubmit}
         validate={validate}
        >
          {(formik) => (
            <StyledModalBox>
              <h2>{title}</h2>
                <Stack>
                  <Field
                    as={TextField}
                    name="fullName"
                    label="Full Name"
                    required
                    {...getFormikProps(formik, 'fullName')}
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    required
                    {...getFormikProps(formik, 'email')}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    required
                   {...getFormikProps(formik, 'password')}
                  />
                  <IconButton onClick={() => formik.handleSubmit()}>
                    {
                      isLoading
                      && <CircularProgress/>
                    }
                    Save
                    </IconButton>
                </Stack>
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
