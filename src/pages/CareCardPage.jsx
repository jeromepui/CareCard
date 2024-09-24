import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import supabase from '../Supabase'

function CareCardPage() {
    const { id } = useParams()
    const [senior, setSenior] = useState(null)
    const [careSummary, setCareSummary] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchSeniorData() {
            const { data, error } = await supabase.from('seniors').select('*').eq('id', id).single()

            if (error) {
                setError('Error fetching senior data')
            } else {
                setSenior(data)
            }
        }

        async function fetchCareSummary() {
            const { data, error } = await supabase
                .from('care_summary')
                .select('response')
                .eq('senior_id', id)
                .single()

            if (error) {
                console.error('Error fetching care summary:', error)
            } else {
                setCareSummary(data.response)
            }
        }

        fetchSeniorData()
        fetchCareSummary()
    }, [id])

    if (error) return <Typography color="error">{error}</Typography>
    if (!senior) return <Typography>Loading...</Typography>

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowBackIcon
                    onClick={() => navigate('/search-carecard')}
                    sx={{ mr: 1, cursor: 'pointer' }}
                />
                <Typography variant="h6">{senior.name}&apos;s CareCard</Typography>
            </Box>
            <Card sx={{ backgroundColor: '#00a17b', color: 'white', mb: 2 }}>
                <CardContent>
                    <Typography variant="h6">{senior.name}</Typography>
                    <Typography>NRIC: XXXXX{senior.last_four_char_NRIC}</Typography>
                    <Typography>Age: {senior.age}</Typography>
                    <Typography>Prefers {senior.spoken_language.join(', ')}</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">Care Summary</Typography>
                    <Typography
                        component="pre"
                        sx={{
                            fontFamily: 'inherit',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}
                    >
                        {careSummary || 'No care summary available.'}
                    </Typography>
                </CardContent>
            </Card>

            <Button
                color="primary"
                component={Link}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                to={`/log-activity/${id}`}
                variant="contained"
            >
                Log Activity
            </Button>
        </Box>
    )
}

export default CareCardPage
