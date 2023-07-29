import React from 'react'
import { UserForm } from '../shared/Form'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { createValidator } from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'

interface AddUserProps {
  onClose: () => void;
}

const initialValues: CreateUser = {
  fullName: '',
  email: '',
  password: '',
}

export const AddUser: React.FC<AddUserProps> = ({ onClose }) => {
  const history = useHistory()

  const createMutation = useMutation(UserService.create, {
    onSuccess: () => {
      console.log('User created successfully')
      console.log('Redirecting to /dashboard')
      history.push('/dashboard')
    },
    onError: (error) => {
      console.error('Error while creating user:', error)
    },
  })

  const onSubmit = async (values: CreateUser | UpdateUser) => {
    if ('password' in values) {
      await createMutation.mutateAsync(values as CreateUser)
    } else {
      console.error('Invalid form values')
    }
  }

  const isLoading = createMutation.isLoading

  return (
    <UserForm
      onClose={onClose}
      initialValues={initialValues}
      mode="add"
      onSubmit={onSubmit}
      validate={createValidator(CreateUser)}
      isLoading={isLoading}
    />
  )
}