import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants'
import { useAuth } from '../hooks/useAuth'
import LoadingState from './LoadingState'

function ProtectedRoute() {
    const { user, isLoading } = useAuth()
    const location = useLocation()
    
    if (isLoading) {
        return <LoadingState />
    }

    const isSignupPage = location.pathname === ROUTES.SIGNUP
    if (!user && !isSignupPage) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
