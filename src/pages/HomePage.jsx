import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../Supabase'
import { useAuth } from '../hooks/useAuth'

function HomePage() {
    const [userName, setUserName] = useState('User')
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
                    setUserName(data.name)
                } else {
                    console.error('Error fetching user data:', error)
                }
            }
        }

        fetchUserName()
    }, [user])

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome, {userName}!
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
                                    Check which organisations are catering to your
                                    beneficiary&apos;s needs
                                </Typography>
                            </Box>
                            <ArrowForwardIcon />
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card>
                    <CardActionArea>
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
