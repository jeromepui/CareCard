import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [error, setError] = useState('')
    const [loginMethod, setLoginMethod] = useState('password') // 'password' or 'magic'
    const { user, signInWithPassword, signInWithOtp } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/home')
        }
    }, [user, navigate])

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            let error
            if (loginMethod === 'password') {
                const { error: signInError } = await signInWithPassword({ email, password })
                error = signInError
            } else {
                const { error: otpError } = await signInWithOtp({ email })
                error = otpError
                if (!error) {
                    setEmailSent(true)
                }
            }

            if (error) {
                setError(error.message || 'Authentication failed. Please try again.')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column' }}>
                <img src={carecardLogo} alt="CareCard Logo" style={{ borderRadius: '16px' }} />

                {emailSent ? (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Check your email
                        </Typography>
                        <Typography color="text.secondary">
                            We sent a magic link to <strong>{email}</strong>
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Click the link in the email to sign in
                        </Typography>
                    </Box>
                ) : (
                    <>
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
                                disabled={isSubmitting}
                            />
                            {loginMethod === 'password' && (
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
                                    disabled={isSubmitting}
                                />
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Signing in...'
                                    : loginMethod === 'password'
                                    ? 'Sign In'
                                    : 'Send Magic Link'}
                            </Button>
                            <Button
                                fullWidth
                                onClick={() =>
                                    setLoginMethod(prev =>
                                        prev === 'password' ? 'magic' : 'password'
                                    )
                                }
                                sx={{ mb: 2 }}
                            >
                                {loginMethod === 'password'
                                    ? 'Sign in with Magic Link'
                                    : 'Sign in with Password'}
                            </Button>
                            {loginMethod === 'password' && (
                                <Button
                                    fullWidth
                                    onClick={() => navigate('/forgot-password')}
                                    sx={{ mb: 2 }}
                                >
                                    Forgot Password?
                                </Button>
                            )}
                            {error && (
                                <Typography color="error" align="center" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                onClick={() => navigate('/signup')}
                                sx={{ textTransform: 'none' }}
                            >
                                Don&apos;t have an account? Sign up
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    )
}

export default LoginPage
