import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Card, CardContent, CircularProgress, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'

function VisitHistoryPage() {
    const navigate = useNavigate()
    const [visits, setVisits] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        async function fetchData() {
            if (user?.email) {
                try {
                    const data = await api.fetchVisits(user.email)
                    setVisits(data)
                } catch (err) {
                    console.error(err)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchData()
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowBackIcon
                    onClick={() => navigate('/home')}
                    sx={{ mr: 1, cursor: 'pointer' }}
                />
                <Typography variant="h6">My Visit History</Typography>
            </Box>
            {visits.length > 0 ? (
                <Grid2 container>
                    {visits.map(visit => (
                        <Grid2 size={12} key={visit.id} sx={{ mb: 1 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{visit.seniors.name}</Typography>
                                    <Typography variant="body1">
                                        Category: {visit.category}
                                    </Typography>
                                    <Typography variant="body1">Issue: {visit.issue}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Date: {new Date(visit.activity_date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            ) : (
                <Typography variant="h6">No visits logged.</Typography>
            )}
        </Box>
    )
}

export default VisitHistoryPage
