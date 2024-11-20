import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import carecardLogo from '../assets/carecard.svg'
import { useAuth } from '../hooks/useAuth'
import supabase from '../Supabase'

function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const { signUp } = useAuth()
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
            const { data: authData, error: authError } = await signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                    emailRedirectTo: `https://carecard.vercel.app/home`,
                },
            })

            if (authError) throw authError

            const { error: dbError } = await supabase.from('volunteers').insert([
                {
                    name,
                    email,
                    auth_id: authData.user.id,
                },
            ])

            if (dbError) throw dbError

            alert('A confirmation link has been sent to your email. Please check your inbox to complete your signup.')
            navigate('/')
        } catch (err) {
            setError(err.message || 'Failed to sign up. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column' }}>
                <img src={carecardLogo} alt="CareCard Logo" style={{ borderRadius: '16px' }} />
                <Typography component="h1" variant="h6" sx={{ mt: 2 }}>
                    Sign up for CareCard
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
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
                        label="Confirm Password"
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
                        disabled={isSubmitting || !name || !email || !password || !confirmPassword}
                    >
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </Button>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button fullWidth onClick={() => navigate('/')} sx={{ textTransform: 'none' }}>
                        Already have an account? Sign in
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default SignupPage
