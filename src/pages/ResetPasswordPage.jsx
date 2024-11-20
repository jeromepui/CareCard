import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'

function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const { updatePassword } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsSubmitting(true)

        try {
            const { error: updateError } = await updatePassword(password)
            if (updateError) throw updateError
            
            alert('Password updated successfully')
            navigate('/')
        } catch (err) {
            console.error('Password update error:', err)
            setError(err.message || 'Failed to update password')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column' }}>
                <img src={carecardLogo} alt="CareCard Logo" style={{ borderRadius: '16px' }} />
                <Typography component="h1" variant="h6" sx={{ mt: 2 }}>
                    Reset Your Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                    </Button>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    )
}

export default ResetPasswordPage 