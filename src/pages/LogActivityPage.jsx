import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import supabase from '../Supabase'
import { useAuth } from '../hooks/useAuth'
import { updateCareSummary } from '../utils/openai'

function LogActivityPage() {
    const { id: senior_id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [volunteer_id, setVolunteerId] = useState('')
    const [name, setName] = useState('')
    const [organisation, setOrganisation] = useState('')
    const [activityType, setActivityType] = useState('')
    const [activityDateTime, setActivityDateTime] = useState(dayjs())
    const [issuesIdentified, setIssuesIdentified] = useState('')
    const [consentGiven, setConsentGiven] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function fetchUserData() {
            if (user?.email) {
                const { data, error } = await supabase
                    .from('volunteers')
                    .select('id, name, organisation')
                    .eq('email', user.email)
                    .single()

                if (data && !error) {
                    setVolunteerId(data.id)
                    setName(data.name)
                    setOrganisation(data.organisation)
                } else {
                    console.error('Error fetching user data:', error)
                }
            }
        }

        fetchUserData()
    }, [user])

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        const { error } = await supabase.from('activities').insert([
            {
                volunteer_id: volunteer_id,
                senior_id: senior_id,
                category: activityType,
                activity_date: activityDateTime.toISOString(),
                issue: issuesIdentified,
            },
        ])

        if (error) {
            console.error('Error inserting activity:', error)
            setIsLoading(false)
        } else {
            await updateCareSummary(senior_id)
            navigate(`/carecard/${senior_id}`, { state: { showToast: true } })
            setIsLoading(false)
        }
    }

    return (
        <Container maxWidth="sm">
            {isLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Updating care summary...
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ mt: 4, mb: 4, overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ArrowBackIcon
                            onClick={() => navigate(-1)}
                            sx={{ mr: 1, cursor: 'pointer' }}
                        />
                        <Typography variant="h6">Log Activity</Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            value={name}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="organisation"
                            label="Organisation"
                            name="organisation"
                            value={organisation}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="activityType"
                            select
                            label="Type of activity"
                            value={activityType}
                            onChange={e => setActivityType(e.target.value)}
                        >
                            <MenuItem value="Befriending/Welfare check">
                                Befriending/Welfare check
                            </MenuItem>
                            <MenuItem value="Delivery">Delivery</MenuItem>
                            <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Date and time of activity"
                                value={activityDateTime}
                                onChange={newValue => setActivityDateTime(newValue)}
                                required
                            />
                        </LocalizationProvider>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="issuesIdentified"
                            label="Issues identified"
                            name="issuesIdentified"
                            multiline
                            rows={10}
                            value={issuesIdentified}
                            onChange={e => setIssuesIdentified(e.target.value)}
                            helperText="(Optional) Comment on whether the resident requires additional support, e.g. housekeeping, meal delivery etc."
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={consentGiven}
                                    onChange={e => setConsentGiven(e.target.checked)}
                                    name="consentGiven"
                                />
                            }
                            required
                            label="I have obtained consent from the resident to update their CareCard details"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading || !consentGiven}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    )
}

export default LogActivityPage
