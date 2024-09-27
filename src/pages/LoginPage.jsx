import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { user, signIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/home')
        }
    }, [user, navigate])

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const { error } = await signIn({ email, password })
            if (error) {
                console.error(error)
            } else {
                navigate('/home')
            }
        } catch (error) {
            console.error('Login error:', error.message)
            // Handle login error (e.g., show error message to user)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <img src={carecardLogo} alt="CareCard Logo" style={{ borderRadius: '16px' }} />
                <Typography component="h1" variant="h6" sx={{ mt: 2 }}>
                    Login to CareCard
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default LoginPage
