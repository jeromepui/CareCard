import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Card, CardActionArea, CardContent, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../Supabase'
import { useAuth } from '../hooks/useAuth'

function HomePage() {
    const [username, setUsername] = useState('User')
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        async function fetchUserName() {
            if (user?.email) {
                const { data, error } = await supabase
                    .from('volunteers')
                    .select('name')
                    .eq('email', user.email)
                    .single()

                if (data && !error) {
                    setUsername(data.name)
                } else {
                    console.error('Error fetching user data:', error)
                }
            }

            setLoading(false)
        }

        fetchUserName()
    }, [user])

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome, {username}!
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
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
                                <Typography variant="h6">Check Resident CareCard</Typography>
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
                                    See your most recently visited households
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
