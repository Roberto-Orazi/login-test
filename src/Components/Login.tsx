import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography, styled } from '@mui/material';
import Button from '@mui/material/Button'

export const Login = () => {
    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafaf6',
                width: '20%',
                margin: '300px auto',
                padding: '200px 100px',
                gap: '2rem',
                borderRadius: '2rem',
            }}
            noValidate
            autoComplete="off"
        >
            <Typography variant="h4" component="h1" gutterBottom sx={{
                display: 'inline-block',
            }}>
                Login
            </Typography>
            <TextField id="Email" label="Email" variant="outlined" />
            <TextField id="Password" label="Password" variant="outlined" />
            <ButtonLogin>Login</ButtonLogin>
        </Box>
    );
}

const ButtonLogin = styled(Button)`
    background-color: #f0f0f0;
    border: none;
    border-radius: 1rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        background-color: #e0e0e0;
    }
`;
