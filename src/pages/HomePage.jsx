import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingState from '../components/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'

function HomePage() {
    const [username, setUsername] = useState('User')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        async function fetchData() {
            try {
                const name = await api.fetchUserName(user.email)
                setUsername(name)
            } catch (error) {
                setError('Error fetching user data')
                console.error('Error fetching user data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [user])

    if (isLoading) {
        return <LoadingState />
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        )
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4">Welcome, {username}!</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Card>
                    <CardActionArea component={Link} to="/search-carecard">
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box>
                                <Typography variant="h6">Check Senior CareCard</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Check on your beneficiary&apos;s latest care summary and needs
                                </Typography>
                            </Box>
                            <ArrowForwardIcon />
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card>
                    <CardActionArea component={Link} to="/visit-history">
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box>
                                <Typography variant="h6">My Visit History</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    See your most recently visited beneficiaries
                                </Typography>
                            </Box>
                            <ArrowForwardIcon />
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
        </Box>
    )
}

export default HomePage
