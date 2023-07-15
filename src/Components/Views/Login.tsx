import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Container, Typography, styled } from '@mui/material'
import Button from '@mui/material/Button'
import { Formik } from 'formik'
import { useMutation } from 'react-query'
import AuthService from '../../services/basics/auth.service'
import { useHistory } from 'react-router-dom'
import { LoginDto } from '../../validations/basic/auth.dto'
import CreateValidator from '../../utils/class-validator-formik'
import { setCredentials } from '../../utils/credentials.helper'
import { useEffect } from 'react'
import { getCredentials } from '../../utils/credentials.helper'
import axios from 'axios'

export const Login = () => {
  const initialValues: LoginDto = {
    email: '',
    password: '',
  }

  const validate = CreateValidator(LoginDto)

  const history = useHistory()

  useEffect(() => {
    const credentials = getCredentials()
    if (credentials) {
      goToHome()
    }
  }, [])

  const loginMutation = useMutation(AuthService.login, {
    onSuccess: ( data ) => {
      setCredentials(data)
      goToHome()
      console.log(data)
    }
  })

  const onSubmit = async (values: LoginDto) => {
    try {
      const response = await axios.post('APITOOOO', values)
      const data = response.data
      setCredentials(data)
      goToHome()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const goToHome = () => history.push('/dashboard')
  return (
    <Container
      component="form"
      maxWidth="sm"
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
      >
        {(formik) => (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#efefe6e7',
            padding: '2rem 1rem',
            borderRadius: '2rem',
          }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'inline-block' }}>
              Login
            </Typography>
            <TextField
              autoFocus
              fullWidth
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
              fullWidth
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
            <ButtonLogin onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || !formik.dirty || loginMutation.isLoading}>Login</ButtonLogin>
          </Box>
        )}
      </Formik>
    </Container>
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