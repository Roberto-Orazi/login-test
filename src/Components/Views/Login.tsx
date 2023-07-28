import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Container, Typography, styled, CircularProgress } from '@mui/material'
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
  const [errorMessage, setErrorMessage] = React.useState('')

  const loginMutation = useMutation(AuthService.login, {
    onSuccess: (data) => {
      setCredentials(data)
      goToHome()
      console.log(data)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const onSubmit = async (values: LoginDto) => {
    setErrorMessage('')
    try {
      await loginMutation.mutateAsync(values)
    } catch (error) {
      setErrorMessage('Incorrect Email or password')
    }
  }
  const goToHome = () => history.push('/dashboard')
  return (
    <Container
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
          <>
            {loginMutation.isLoading ? (
              <StyledLoadingWrapper>
                <CircularProgress size={80} />
              </StyledLoadingWrapper>
            ) : (
              <StyledFormWrapper>
                <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'inline-block' }}>
                  Login
                </Typography>
                <TextField
                  autoFocus
                  fullWidth
                  label="Email"
                  placeholder="example@example.com"
                  name="email"
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <StyledButton
                  onClick={() => formik.handleSubmit()}
                  disabled={!formik.isValid || !formik.dirty || loginMutation.isLoading}
                >
                  Login
                  {loginMutation.isLoading && <CircularProgress size={24} className="loading" />}
                </StyledButton>
                {errorMessage && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errorMessage}
                  </Typography>
                )}
              </StyledFormWrapper>
            )}
          </>
        )}
      </Formik>
    </Container>
  )
}

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#7d7d7d',
  border: 'none',
  borderRadius: '1rem',
  padding: '1rem 2rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#000000',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#939292',
  },
  // Estilos en estado de carga
  '&.loading': {
    backgroundColor: theme.palette.action.disabledBackground,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none',
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '2rem',
      height: '2rem',
      borderTop: '2px solid #000',
      borderRight: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  },
}))

const StyledFormWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '2rem',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#efefe6e7',
  padding: '2rem 1rem',
  borderRadius: '2rem',
})

const StyledLoadingWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100%',
  backgroundColor: '#fff',
})