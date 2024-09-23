import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, CircularProgress, Container, IconButton, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import NavigationDrawer from './components/NavigationDrawer'
import { useAuth } from './hooks/useAuth'

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, signOut, loading } = useAuth()

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    useEffect(() => {
        if (loading) {
            return // Don't do anything while loading
        }
        if (!user && location.pathname !== '/') {
            navigate('/')
        }
    }, [user, loading, location.pathname, navigate])

    const isLoginPage = location.pathname === '/'

    return (
        <>
            {loading ? (
                <CircularProgress /> // Or any loading indicator
            ) : (
                <>
                    <AppBar position="static" color="primary" elevation={0}>
                        <Toolbar>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/home"
                                sx={{
                                    flexGrow: 1,
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >
                                CareCard
                            </Typography>
                            {!isLoginPage && user && (
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={toggleDrawer}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        </Toolbar>
                    </AppBar>
                    {!isLoginPage && user && (
                        <NavigationDrawer
                            isOpen={isDrawerOpen}
                            onClose={toggleDrawer}
                            onSignOut={handleSignOut}
                        />
                    )}
                    <Container maxWidth="sm">
                        <Outlet />
                    </Container>
                </>
            )}
        </>
    )
}

export default App
