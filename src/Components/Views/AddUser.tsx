import React from 'react'
import { UserForm } from '../shared/Form'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { createValidator } from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { useMutation } from 'react-query'

interface AddUserProps {
  open: boolean;
  onClose: () => void;
}

const initialValues: CreateUser = {
  fullName: '',
  email: '',
  password: '',
}

export const AddUser: React.FC<AddUserProps> = ({ open, onClose }) => {
  const validate = createValidator(CreateUser)

  const createMutation = useMutation(UserService.create, {
    onSuccess: () => {
      onClose()
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
      open={open}
      onClose={onClose}
      initialValues={initialValues}
      mode="add"
      onSubmit={onSubmit}
      validate={validate}
      isLoading={isLoading}
    />
  )
}
