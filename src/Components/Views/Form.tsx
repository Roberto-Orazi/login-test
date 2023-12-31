import React, { useEffect } from 'react'
import { TextField, Button, CircularProgress, Stack, Box, styled } from '@mui/material'
import { Formik, Field, FormikHelpers, FormikErrors, FormikTouched } from 'formik'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { createValidator } from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { useMutation, useQueryClient } from 'react-query'
import { User, } from '../../types/types'
import { useHistory } from 'react-router-dom'
import { ELinks } from '../navigation/navigation.types'

interface UserFormProps {
  onClose: () => void;
  initialValues: CreateUser | UpdateUser;
  mode: 'add' | 'update';
  onSubmit: (values: CreateUser | UpdateUser, formik: FormikHelpers<CreateUser | UpdateUser>) => Promise<void>;
  validate: (data: any) => any;
  isLoading: boolean;
}


type Values = CreateUser | UpdateUser

export const UserForm: React.FC<UserFormProps> = ({ initialValues, mode }) => {
  const queryClient = useQueryClient()
  const USERS_QUERY_KEY = 'users'
  const history = useHistory()
  const onSuccess = () => {
    onClose()
    queryClient.invalidateQueries(USERS_QUERY_KEY)
  }

  const onError = (error: any, action: 'create' | 'update') => {
    console.error(`Error while ${action === 'create' ? 'creating' : 'updating'} user:`, error)
  }
  const onClose = () => {
    history.push({
      pathname: ELinks.dashboard,
    })
  }
  const createMutation = useMutation(UserService.create, {
    onSuccess,
    onError: (error) => onError(error, 'create'),
    onSettled: () => queryClient.invalidateQueries(USERS_QUERY_KEY),
  })

  const updateMutation = useMutation<User, unknown, UpdateUser>((dto) => UserService.update('', dto), {
    onSuccess,
    onError: (error) => onError(error, 'update'),
    onSettled: () => queryClient.invalidateQueries(USERS_QUERY_KEY),
  })

  const onSubmit = async (values: Values, formik: FormikHelpers<Values>) => {
    if (mode === 'add') {
      await createMutation.mutateAsync(values as CreateUser)
    } else if (mode === 'update') {
      await updateMutation.mutateAsync(values as UpdateUser)
    }

    formik.resetForm()
  }

  const validate = mode === 'add' ? createValidator(CreateUser) : createValidator(UpdateUser)

  const isLoading = createMutation.isLoading || updateMutation.isLoading

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersData = await UserService.list()
        console.log('Fetched users data:', usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsersData()
  }, [])

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}>
        {(formik) => (
          <Box sx={{
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '5rem'
          }}>
            <h2>{mode === 'add' ? 'Add User' : 'Edit User'}</h2>
            <Stack sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <Field
                as={TextField}
                name="fullName"
                label="Full Name"
                required
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />

              <Field
                as={TextField}
                name="email"
                label="Email"
                required
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              {mode === 'add' && (
                <>
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    required
                    error={(formik.touched as FormikTouched<CreateUser>).password
                      && Boolean((formik.errors as FormikErrors<CreateUser>).password)}
                    helperText={(formik.touched as FormikTouched<CreateUser>).password
                      && (formik.errors as FormikErrors<CreateUser>).password}
                  />
                </>
              )}

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: '1rem 0',
                gap: '2rem'
              }}>
                <SaveButton type="submit" onClick={() => formik.handleSubmit()}>
                  {isLoading && <CircularProgress />}
                  Save
                </SaveButton>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
              </Box>
            </Stack>
          </Box>
        )}
      </Formik>
    </Box>
  )
}

const SaveButton = styled(Button)`
background-color: #4dd14d;
color: white;
border-radius: 1rem;
padding: 1rem;
&:hover{
  background-color: #6fe36f;
}
`
const CancelButton = styled(Button)`
background-color: #a32020;
color: white;
border-radius: 1rem;
padding: 1rem;
&:hover{
  background-color: #a32020;
}
`