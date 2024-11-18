import { Box, CircularProgress, Typography } from '@mui/material'
import PropTypes from 'prop-types'

function LoadingState({ message = 'Loading...' }) {
    return (
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
                {message}
            </Typography>
        </Box>
    )
}

LoadingState.propTypes = {
    message: PropTypes.string
}

export default LoadingState 