import {
    Box,
    Button,
    Checkbox,
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
import { api } from '../services/api'
import BackButton from '../components/BackButton'
import LoadingState from '../components/LoadingState'

function LogActivityPage() {
    const { id: seniorId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [volunteerId, setVolunteerId] = useState('')
    const [name, setName] = useState('')
    const [organisation, setOrganisation] = useState('')
    const [category, setCategory] = useState('')
    const [activityDate, setActivityDate] = useState(dayjs())
    const [issuesIdentified, setIssuesIdentified] = useState('')
    const [consentGiven, setConsentGiven] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await api.fetchUserData(user.email)
                setVolunteerId(data.id)
                setName(data.name)
                setOrganisation(data.organisation)
            } catch (error) {
                console.error('Error fetching user data:', error)
                setError('Error fetching user data')
            }
        }

        fetchData()
    }, [user])

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error: submitError } = await supabase.from('activities').insert([
                {
                    volunteer_id: volunteerId,
                    senior_id: seniorId,
                    category: category,
                    activity_date: activityDate.toISOString(),
                    issue: issuesIdentified,
                },
            ])

            if (submitError) throw submitError

            const { error: functionError } = await supabase.functions.invoke('openai', {
                body: { senior_id: seniorId },
            })

            if (functionError) throw functionError

            navigate(`/carecard/${seniorId}`, { state: { showToast: true } })
        } catch (error) {
            console.error('Error submitting activity:', error)
            setError('Error submitting activity')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{ mt: 4 }}>
            {isLoading ? (
                <LoadingState message="Updating care summary..." />
            ) : (
                <Box sx={{ mt: 4, mb: 4, overflowY: 'auto' }}>
                    <BackButton title="Log Activity" />
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
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
                            id="category"
                            select
                            label="Type of activity"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
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
                                value={activityDate}
                                onChange={newValue => setActivityDate(newValue)}
                                required
                                sx={{ mt: 2 }}
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
        </Box>
    )
}

export default LogActivityPage
