import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function BackButton({ title, onBack, to }) {
    const navigate = useNavigate()
    
    const handleClick = () => {
        if (onBack) {
            onBack()
        } else if (to) {
            navigate(to)
        } else {
            navigate(-1)
        }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ArrowBackIcon
                onClick={handleClick}
                sx={{ mr: 1, cursor: 'pointer' }}
            />
            {title && <Typography variant="h6">{title}</Typography>}
        </Box>
    )
}

export default BackButton
