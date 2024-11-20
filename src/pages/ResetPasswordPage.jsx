import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'
import supabase from '../Supabase'

function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const { updatePassword } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const hashParts = window.location.hash.split('=')
                if (hashParts.length === 2) {
                    const accessToken = hashParts[1]
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash: accessToken,
                        type: 'recovery',
                    })
                    if (error) {
                        setError('Invalid or expired reset link')
                    }
                }
            } catch (error) {
                console.error('Error processing reset link:', error)
                setError('Error processing reset link')
            }
        }

        verifyToken()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsSubmitting(true)

        try {
            const { error: updateError } = await updatePassword(password)
            if (updateError) throw updateError

            alert('Password updated successfully')
            await supabase.auth.signOut()
            navigate('/')
        } catch (error) {
            setError(error.message || 'Failed to update password')
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
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1, width: '100%' }}
                >
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
