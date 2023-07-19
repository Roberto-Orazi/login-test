import React, { useState } from 'react'
import { Modal, TextField, Button } from '@mui/material'
import { User } from '../../types/types'

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedUser, setEditedUser] = useState<User>(user)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  const handleSave = () => {
    onSave(editedUser)
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="modal-content">
        <h2>Edit User</h2>
        <TextField
          name="fullName"
          label="Full Name"
          value={editedUser.fullName}
          onChange={handleInputChange}
        />
        <TextField
          name="email"
          label="Email"
          value={editedUser.email}
          onChange={handleInputChange}
        />
        <TextField
          name="password"
          label="Password"
          value={editedUser.password}
          onChange={handleInputChange}
        />
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  )
}
