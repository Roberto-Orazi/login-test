import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Typography, styled } from '@mui/material'
import Button from '@mui/material/Button'
import { Formik } from 'formik'
import { useMutation } from 'react-query'
import AuthService from '../../services/basics/auth.service'
import { useHistory } from 'react-router-dom'
import { LoginDto } from '../../validations/basic/auth.dto'
import CreateValidator from '../../utils/class-validator-formik'
import { getCredentials, setCredentials } from '../../utils/credentials.helper'


export const Login = () => {
  const initialValues: LoginDto = {
    email: '',
    password: '',
  }

  const validate = CreateValidator(LoginDto)
  const history = useHistory()
  const loginMutation = useMutation(AuthService.login, {
    onSuccess: ({ data }) => {
      setCredentials(data)
      goToHome()
    }
  })

  useEffect(() => {
    const credentials = getCredentials()
    if (credentials) {
      goToHome()
    }
  }, [])
  const onSubmit = async (values: LoginDto) => {
    await loginMutation.mutateAsync(values)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = event.currentTarget.email.value
    const password = event.currentTarget.password.value
    console.log('Email:', email)
    console.log('Password:', password)
  }
  const goToHome = () => history.push('/home')
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#efefe6e7',
        width: '20%',
        margin: '300px auto',
        padding: '200px 100px',
        gap: '2rem',
        borderRadius: '2rem',
      }}
      noValidate
      autoComplete="off"
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {(formik) => (
          <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'inline-block' }}>
          Login
        </Typography>
        <TextField
          autoFocus
          label="Email"
          placeholder="example@example.com"
          name='email'
          onBlur={formik.handleBlur}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="Password"
          name='password'
          type='password'
          placeholder="********"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <ButtonLogin     onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || !formik.dirty || loginMutation.isLoading}>Login</ButtonLogin>
        </Box>
        )}
      </Formik>
    </Box>
  )
}

const ButtonLogin = styled(Button)`
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