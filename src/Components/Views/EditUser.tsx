import React from 'react'
import { UserForm } from '../shared/Form'
import { CreateUser, UpdateUser } from '../../validations/basic/user.dto'
import { createValidator } from '../../utils/class-validator-formik'
import { UserService } from '../../services/basics/user.service'
import { useMutation } from 'react-query'
import { User } from '@/types/types'
import { useHistory } from 'react-router-dom'
import { ELinks } from '../navigation/navigation.types'

interface EditUserProps {
  onClose: () => void;
  location: {
    state: {
      initialValues: User;
    };
  };
}

export const EditUser: React.FC<EditUserProps> = ({ location, onClose }) => {
  const history = useHistory()
  const goHome = () => {
    history.push({
      pathname: ELinks.dashboard,
    })
  }
  const updateMutation = useMutation<User, unknown, UpdateUser>((dto) => UserService.update('', dto), {
    onSuccess: () => {
      goHome()
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
      onClose={onClose}
      initialValues={location.state.initialValues}
      mode={location.state.initialValues instanceof CreateUser ? 'add' : 'update'}
      onSubmit={onSubmit}
      validate={createValidator(UpdateUser)}
      isLoading={isLoading}
    />
  )
}