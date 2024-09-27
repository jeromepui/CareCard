import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, CircularProgress, Container, IconButton, Toolbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import carecardLogo from './assets/carecard.svg'
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
            return
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
                    <AppBar position="static" color="primary">
                        <Toolbar sx={{ justifyContent: 'space-between' }}>
                            <img
                                alt="CareCard Logo"
                                src={carecardLogo}
                                onClick={() => navigate('/home')}
                                style={{ borderRadius: '16px', cursor: 'pointer' }}
                                width="65px"
                            />
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
