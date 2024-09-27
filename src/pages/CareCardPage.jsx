import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Card, CardContent, CircularProgress, Fab, Tab, Tabs, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'

function CareCardPage() {
    const { id } = useParams()
    const [senior, setSenior] = useState(null)
    const [careSummary, setCareSummary] = useState('')
    const [recentVisits, setRecentVisits] = useState([])
    const [organisations, setOrganisations] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const [seniorData, careSummaryData, recentVisitsData, organisationsData] =
                    await Promise.all([
                        api.fetchSeniorData(id),
                        api.fetchCareSummary(id),
                        api.fetchRecentVisits(id),
                        api.fetchOrganisations(id),
                    ])

                setSenior(seniorData)
                setCareSummary(careSummaryData)
                setRecentVisits(recentVisitsData)

                const orgMap = new Map()

                organisationsData.forEach(item => {
                    if (item.volunteers?.organisations) {
                        const org = item.volunteers.organisations
                        if (!orgMap.has(org.name)) {
                            orgMap.set(org.name, {
                                categories: new Set(),
                                contact_info: org.contact_info,
                            })
                        }
                        orgMap.get(org.name).categories.add(item.category)
                    }
                })

                const orgList = Array.from(orgMap, ([name, data]) => ({
                    name,
                    categories: Array.from(data.categories),
                    contact_info: data.contact_info,
                }))

                setOrganisations(orgList)
            } catch (error) {
                setError('Error fetching data: ', error)
            }

            setIsLoading(false)
        }

        fetchData()
    }, [id])

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    if (error)
        return (
            <Box sx={{ display: 'flex', mt: 4 }}>
                <ArrowBackIcon
                    onClick={() => navigate('/search-carecard')}
                    sx={{ mr: 1, cursor: 'pointer' }}
                />
                <Typography color="error">{error}</Typography>
            </Box>
        )

    if (isLoading) {
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
                    onClick={() => navigate('/search-carecard')}
                    sx={{ mr: 1, cursor: 'pointer' }}
                />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {senior.name}&apos;s CareCard
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card sx={{ backgroundColor: '#00a17b', color: 'white', mb: 2, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h6">{senior.name}</Typography>
                        <Typography>NRIC: XXXXX{senior.last_four_char_NRIC}</Typography>
                        <Typography>Age: {senior.age}</Typography>
                        <Typography>Prefers {senior.spoken_language.join(', ')}</Typography>
                    </CardContent>
                </Card>

                <Box sx={{ width: '100%' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
                        <Tab label="Care Summary" />
                        <Tab label="Recent Visits" />
                        <Tab label="Organisations" />
                    </Tabs>
                </Box>

                {activeTab === 0 && (
                    <Card sx={{ width: '100%', mt: 2 }}>
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
                )}

                {activeTab === 1 && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        {recentVisits.length > 0 ? (
                            recentVisits.map(visit => (
                                <Card key={visit.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {new Date(visit.activity_date).toLocaleDateString()}
                                        </Typography>
                                        <Typography>Category: {visit.category}</Typography>
                                        <Typography>Issue: {visit.issue}</Typography>
                                        <Typography>
                                            Organisation:{' '}
                                            {visit.volunteer ? visit.volunteer.organisation : 'N/A'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No recent visits available.</Typography>
                        )}
                    </Box>
                )}

                {activeTab === 2 && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        {organisations.length > 0 ? (
                            organisations.map((org, index) => (
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{org.name}</Typography>
                                        <Typography>
                                            Categories: {org.categories.join(', ')}
                                        </Typography>
                                        <Typography>Contact: {org.contact_info}</Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No organisations available.</Typography>
                        )}
                    </Box>
                )}

                <Fab
                    color="primary"
                    sx={{ position: 'sticky', bottom: 20, mt: 2 }}
                    onClick={() => navigate(`/log-activity/${id}`)}
                    variant="extended"
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Log Activity
                </Fab>
            </Box>
        </Box>
    )
}

export default CareCardPage
