import React from 'react'
import './syles/App.css'
import { Login } from './Components/Views/Login'
import { StyledEngineProvider, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions:{
    queries: {
      staleTime: 2*(1000*60)
    }
  }
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={''}>
    <Login />
    </ThemeProvider>
    </StyledEngineProvider>
    </QueryClientProvider>
  )
}

export default App
