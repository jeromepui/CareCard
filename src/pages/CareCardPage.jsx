import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Card, CardContent, Fab, Tab, Tabs, Typography, IconButton, TextField, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingState from '../components/LoadingState'
import { api } from '../services/api'
import BackButton from '../components/BackButton'

function CareCardPage() {
    const { id: seniorId } = useParams()
    const [senior, setSenior] = useState(null)
    const [careSummary, setCareSummary] = useState('')
    const [recentVisits, setRecentVisits] = useState([])
    const [organisations, setOrganisations] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [tempCareSummary, setTempCareSummary] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const [seniorData, careSummaryData, recentVisitsData, organisationsData] =
                    await Promise.all([
                        api.fetchSeniorData(seniorId),
                        api.fetchCareSummary(seniorId),
                        api.fetchRecentVisits(seniorId),
                        api.fetchOrganisations(seniorId),
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
                setError('Error fetching data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [seniorId])

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    if (error)
        return (
            <Box sx={{ display: 'flex', mt: 4 }}>
                <BackButton title="Enter resident details" to="/home" />
                <Typography color="error">{error}</Typography>
            </Box>
        )

    if (isLoading) {
        return <LoadingState />
    }

    return (
        <Box sx={{ mt: 4 }}>
            <BackButton 
                title={`${senior.name}'s CareCard`} 
                to="/search-carecard"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card sx={{ backgroundColor: '#00a17b', color: 'white', mb: 2, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h6">{senior.name}</Typography>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Care Summary</Typography>
                                <Button
                                    startIcon={<EditIcon />}
                                    onClick={() => {
                                        setIsEditing(!isEditing)
                                        setTempCareSummary(careSummary)
                                    }}
                                >
                                    Edit
                                </Button>
                            </Box>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    value={tempCareSummary}
                                    onChange={(e) => setTempCareSummary(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            ) : (
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
                            )}
                            {isEditing && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={async () => {
                                            try {
                                                await api.updateCareSummary(seniorId, tempCareSummary)
                                                setCareSummary(tempCareSummary)
                                                setIsEditing(false)
                                            } catch (error) {
                                                setError('Error updating care summary')
                                            }
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setTempCareSummary('')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            )}
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
                    onClick={() => navigate(`/log-activity/${seniorId}`)}
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
