import React from 'react'
import { UserForm } from '../shared/Form'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { createValidator } from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { useMutation } from 'react-query'
import { User } from '@/types/types'

interface EditUserProps {
  open: boolean;
  onClose: () => void;
  initialValues: UpdateUser | CreateUser;
}

export const EditUser: React.FC<EditUserProps> = ({ open, onClose, initialValues }) => {
  const validate = createValidator(initialValues instanceof CreateUser ? CreateUser : UpdateUser)

  const updateMutation = useMutation<User, unknown, UpdateUser>((dto) => UserService.update('', dto), {
    onSuccess: () => {
      onClose()
    },
    onError: (error) => {
      console.error('Error while updating user:', error)
    },
  })

  const onSubmit = async (values: UpdateUser | CreateUser) => {
    if ('id' in values) {
      await updateMutation.mutateAsync(values as UpdateUser)
    } else {
      console.error('Invalid form values')
    }
  }

  const isLoading = updateMutation.isLoading

  return (
    <UserForm
      open={open}
      onClose={onClose}
      initialValues={initialValues}
      mode={initialValues instanceof CreateUser ? 'add' : 'update'}
      onSubmit={onSubmit}
      validate={validate}
      isLoading={isLoading}
    />
  )
}