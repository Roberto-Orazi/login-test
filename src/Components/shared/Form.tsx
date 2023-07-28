import React, { useEffect } from 'react'
import { Modal, TextField, Button, CircularProgress, Stack, Box } from '@mui/material'
import { Formik, Field, FormikHelpers } from 'formik'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { createValidator } from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { useMutation, useQueryClient } from 'react-query'
import { User } from '../../types/types'

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  initialValues: CreateUser | UpdateUser;
  mode: 'add' | 'update';
  onSubmit: (values: CreateUser | UpdateUser, formik: FormikHelpers<CreateUser | UpdateUser>) => Promise<void>;
  validate: (data: any) => any;
  isLoading: boolean;

}

type Values = CreateUser | UpdateUser

export const UserForm: React.FC<UserFormProps> = ({ open, onClose, initialValues, mode }) => {
  const queryClient = useQueryClient()

  const USERS_QUERY_KEY = 'users'

  const onSuccess = () => {
    queryClient.invalidateQueries('email')
    onClose()
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

  const updateMutation = useMutation<User, unknown, UpdateUser>((dto) => UserService.update('', dto), {
    onSuccess,
    onError: (error) => onError(error, 'update'),
    onSettled: () => queryClient.invalidateQueries(USERS_QUERY_KEY),
  })

  const onSubmit = async (values: Values, formik: FormikHelpers<Values>) => {
    console.log('Form values:', values)

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
    <Modal open={open} onClose={onClose} sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
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
              <Field as={TextField} name="fullName" label="Full Name" required />
              <Field as={TextField} name="email" label="Email" required />
              {mode === 'add' && <Field as={TextField} name="password" label="Password" type="password" required />}
              <Box sx={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', gap: '2rem' }}>
                <Button type="submit" onClick={() => formik.handleSubmit()}>
                  {isLoading && <CircularProgress />}
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Formik>
    </Modal>
  )
}


