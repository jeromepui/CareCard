import {
    Box,
    Card,
    CardContent,
    Grid2,
    Typography,
    Pagination,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    MenuItem,
} from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingState from '../components/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import BackButton from '../components/BackButton'

function VisitHistoryPage() {
    const [visits, setVisits] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()
    const [page, setPage] = useState(1)
    const itemsPerPage = 5
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedVisit, setSelectedVisit] = useState(null)
    const [editFormData, setEditFormData] = useState({
        category: '',
        activity_date: null,
        issue: '',
    })

    const totalPages = Math.ceil(visits.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const paginatedVisits = visits.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (event, value) => {
        setPage(value)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await api.fetchVisits(user.email)
                setVisits(data)
            } catch (error) {
                console.error('Error fetching visit history:', error)
                setError('Error fetching visit history')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [user])

    const handleEditClick = visit => {
        setSelectedVisit(visit)
        setEditFormData({
            category: visit.category || '',
            activity_date: dayjs(visit.activity_date),
            issue: visit.issue || '',
        })
        setEditModalOpen(true)
    }

    const handleEditSubmit = async () => {
        try {
            const updateData = {
                category: editFormData.category,
                activity_date: editFormData.activity_date.toISOString(),
                issue: editFormData.issue,
            }

            await api.updateVisit(selectedVisit.id, updateData)

            const updatedVisits = visits.map(visit => {
                if (visit.id === selectedVisit.id) {
                    return {
                        ...visit,
                        category: editFormData.category,
                        activity_date: editFormData.activity_date.toISOString(),
                        issue: editFormData.issue,
                        seniors: visit.seniors,
                    }
                }
                return visit
            })

            setVisits(updatedVisits)
            setEditModalOpen(false)
            setSelectedVisit(null)
        } catch (error) {
            console.error('Error updating visit:', error)
            setError('Error updating visit')
        }
    }

    const handleDelete = async visitId => {
        if (window.confirm('Are you sure you want to delete this visit?')) {
            try {
                await api.deleteVisit(visitId)
                setVisits(visits.filter(visit => visit.id !== visitId))
            } catch (error) {
                console.error('Error deleting visit:', error)
                setError('Error deleting visit')
            }
        }
    }

    if (isLoading) {
        return <LoadingState />
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        )
    }

    return (
        <Box sx={{ mt: 4 }}>
            <BackButton title="Visit History" />
            {visits.length > 0 ? (
                <>
                    <Grid2 container>
                        {paginatedVisits.map(visit => (
                            <Grid2 size={12} key={visit.id} sx={{ mb: 1 }}>
                                <Card>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="h6">
                                                    {visit.seniors.name}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Category: {visit.category}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Issue: {visit.issue || 'NA'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Date:{' '}
                                                    {new Date(
                                                        visit.activity_date
                                                    ).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    onClick={() => handleEditClick(visit)}
                                                    size="small"
                                                    sx={{ padding: '4px' }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(visit.id)}
                                                    size="small"
                                                    color="error"
                                                    sx={{ padding: '4px' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Typography variant="h6">No visits logged.</Typography>
            )}
            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Visit</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Type of activity"
                        value={editFormData.category}
                        onChange={e =>
                            setEditFormData({ ...editFormData, category: e.target.value })
                        }
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
                            value={editFormData.activity_date}
                            onChange={newValue =>
                                setEditFormData({ ...editFormData, activity_date: newValue })
                            }
                            required
                            sx={{ mt: 2 }}
                        />
                    </LocalizationProvider>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Issues identified"
                        multiline
                        rows={10}
                        value={editFormData.issue}
                        onChange={e => setEditFormData({ ...editFormData, issue: e.target.value })}
                        helperText="(Optional) Comment on whether the resident requires additional support, e.g. housekeeping, meal delivery etc."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default VisitHistoryPage
