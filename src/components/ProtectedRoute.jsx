import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute() {
    const { user } = useAuth()
    const location = useLocation()

    if (!user && location.pathname !== ROUTES.SIGNUP) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
