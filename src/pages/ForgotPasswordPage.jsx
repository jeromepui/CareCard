import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'
import BackButton from '../components/BackButton'

function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [error, setError] = useState('')
    const { resetPasswordForEmail } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const { error: resetError } = await resetPasswordForEmail(email)
            if (resetError) throw resetError
            setEmailSent(true)
        } catch (err) {
            setError(err.message || 'Failed to send reset password email')
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
                            We sent a password reset link to <strong>{email}</strong>
                        </Typography>
                        <Button
                            fullWidth
                            onClick={() => navigate('/')}
                            sx={{ mt: 2 }}
                        >
                            Return to Login
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Typography component="h1" variant="h6" sx={{ mt: 2 }}>
                            Reset Password
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
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            {error && (
                                <Typography color="error" align="center" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                onClick={() => navigate('/')}
                                sx={{ textTransform: 'none' }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    )
}

export default ForgotPasswordPage 