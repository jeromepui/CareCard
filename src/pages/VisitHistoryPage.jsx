import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Card, CardContent, CircularProgress, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../Supabase'
import { useAuth } from '../hooks/useAuth'

function VisitHistoryPage() {
    const navigate = useNavigate()
    const [visits, setVisits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        async function fetchVisits() {
            if (user?.email) {
                try {
                    const { data: volunteerData, error: volunteerError } = await supabase
                        .from('volunteers')
                        .select('id')
                        .eq('email', user.email)
                        .single()

                    if (volunteerError) throw volunteerError

                    const { data, error } = await supabase
                        .from('activities')
                        .select(
                            'id, volunteer_id, category, issue, activity_date, seniors (id, name)'
                        )
                        .eq('volunteer_id', volunteerData.id)
                        .order('created_at', { ascending: false })

                    if (error) throw error

                    setVisits(data)
                } catch (err) {
                    setError(err.message)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchVisits()
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

    if (error) return <Typography color="error">{error}</Typography>

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
                <Grid2 container spacing={2}>
                    {visits.map(visit => (
                        <Grid2 size={12} key={visit.id}>
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
                <Typography variant="h6">No visits recorded.</Typography>
            )}
        </Box>
    )
}

export default VisitHistoryPage
