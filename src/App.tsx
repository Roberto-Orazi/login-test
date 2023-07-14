import React from 'react'
import './syles/App.css'
import { StyledEngineProvider, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppNavigation } from './Components/routes/navigation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * (1000 * 60)
    }
  }
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={''}>
          <AppNavigation />
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  )
}

export default App
