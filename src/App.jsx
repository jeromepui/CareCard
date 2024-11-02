import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Container, IconButton, Toolbar } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import carecardLogo from './assets/carecard.svg'
import LoadingSpinner from './components/LoadingSpinner'
import NavigationDrawer from './components/NavigationDrawer'
import { ROUTES } from './constants'
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

    const isPublicRoute = useCallback(() => {
        return location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP
    }, [location.pathname])

    useEffect(() => {
        if (loading) {
            return
        }
        if (!user && !isPublicRoute()) {
            navigate('/')
        }
    }, [user, loading, location.pathname, navigate, isPublicRoute])

    const isLoginPage = isPublicRoute()

    return (
        <>
            {loading ? (
                <LoadingSpinner />
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
