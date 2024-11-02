import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [error, setError] = useState('')
    const { user, signIn } = useAuth()
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
            const { error } = await signIn({ email })

            if (error) {
                if (error.message) {
                    setError(error.message)
                } else {
                    setError('Failed to send magic link. Please try again.')
                }
                console.error('Auth error:', error)
            } else {
                setEmailSent(true)
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Magic Link'}
                            </Button>
                            {error && (
                                <Typography color="error" align="center" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    )
}

export default LoginPage
