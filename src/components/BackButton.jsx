import PropTypes from 'prop-types'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Typography, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

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
        <Box component="nav" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleClick} aria-label={title || 'Go back'} sx={{ mr: 1 }}>
                <ArrowBackIcon />
            </IconButton>
            {title && <Typography variant="h6">{title}</Typography>}
        </Box>
    )
}

BackButton.propTypes = {
    title: PropTypes.string,
    onBack: PropTypes.func,
    to: PropTypes.string,
}

export default BackButton
