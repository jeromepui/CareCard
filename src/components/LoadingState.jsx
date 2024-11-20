import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingState({ 
    message = 'Loading...', 
    height = '100vh',
    size = 60 
}) {
    return (
        <Box
            role="status"
            aria-live="polite"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height,
            }}
        >
            <CircularProgress 
                size={size}
                aria-label="Loading indicator" 
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
                {message}
            </Typography>
        </Box>
    )
}

export default LoadingState 