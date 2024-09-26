import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../Supabase'

function SearchCareCardPage() {
    const [nric, setNric] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [consent, setConsent] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')

        const { data, error } = await supabase
            .from('seniors')
            .select('id')
            .eq('last_four_char_NRIC', nric.toUpperCase())
            .eq('postal_code', postalCode)
            .single()

        if (error) {
            setError('No senior record found')
        } else if (data) {
            navigate(`/carecard/${data.id}`)
        }
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowBackIcon
                    onClick={() => navigate('/home')}
                    sx={{ mr: 1, cursor: 'pointer' }}
                />
                <Typography variant="h6">Enter resident details</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Last 4 characters of NRIC"
                    value={nric}
                    onChange={e => setNric(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Postal code"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    margin="normal"
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={consent}
                            onChange={e => setConsent(e.target.checked)}
                            required
                        />
                    }
                    label="I have obtained consent from the resident to access their CareCard details."
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!consent}
                >
                    Search CareCard
                </Button>
                {error && (
                    <Typography color="error" variant="body2" align="center">
                        {error}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default SearchCareCardPage
