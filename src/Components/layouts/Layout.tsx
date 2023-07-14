import { Container, CssBaseline } from '@mui/material'
import { Box } from '@mui/system'

interface props {
  children: any;
}

export const Layout = (props: props) => {
  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        {props.children}
      </Container>
    </Box>
  )
}