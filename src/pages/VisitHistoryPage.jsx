import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Card, CardContent, Grid2, Typography, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function VisitHistoryPage() {
    const navigate = useNavigate()
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
        issue: '',
        resolved_issues: ''
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
            } catch (err) {
                setError('Error fetching visit history')
                console.error('Error fetching visits:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [user])

    const handleEditClick = (visit) => {
        setSelectedVisit(visit)
        setEditFormData({
            issue: visit.issue || '',
            resolved_issues: visit.resolved || '' // note: matches your DB field name
        })
        setEditModalOpen(true)
    }

    const handleEditSubmit = async () => {
        try {
            const updateData = {
                issue: editFormData.issue,
                resolved_issues: editFormData.resolved_issues
            }
            await api.updateVisit(selectedVisit.id, updateData)
            const updatedVisits = visits.map(visit => 
                visit.id === selectedVisit.id 
                    ? { ...visit, issue: updateData.issue, resolved: updateData.resolved_issues }
                    : visit
            )
            setVisits(updatedVisits)
            setEditModalOpen(false)
            setSelectedVisit(null)
        } catch (err) {
            console.error('Error updating visit:', err)
            setError('Error updating visit')
        }
    }

    const handleDelete = async (visitId) => {
        if (window.confirm('Are you sure you want to delete this visit?')) {
            try {
                await api.deleteVisit(visitId)
                setVisits(visits.filter(visit => visit.id !== visitId))
            } catch (err) {
                console.error('Error deleting visit:', err)
                setError('Error deleting visit')
            }
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowBackIcon
                    onClick={() => navigate('/home')}
                    sx={{ mr: 1, cursor: 'pointer' }}
                />
                <Typography variant="h6">My Visit History</Typography>
            </Box>
            {visits.length > 0 ? (
                <>
                    <Grid2 container>
                        {paginatedVisits.map(visit => (
                            <Grid2 size={12} key={visit.id} sx={{ mb: 1 }}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="h6">{visit.seniors.name}</Typography>
                                                <Typography variant="body1">
                                                    Category: {visit.category}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Issues Identified: {visit.issue || 'NA'}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Issues Resolved: {visit.resolved || 'NA'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Date: {new Date(visit.activity_date).toLocaleDateString()}
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
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <DialogTitle>Edit Visit</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                        Category: {selectedVisit?.category}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Issues Identified"
                        value={editFormData.issue}
                        onChange={(e) => setEditFormData({ ...editFormData, issue: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Issues Resolved"
                        value={editFormData.resolved_issues}
                        onChange={(e) => setEditFormData({ ...editFormData, resolved_issues: e.target.value })}
                        margin="normal"
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
