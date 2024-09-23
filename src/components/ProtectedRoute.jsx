import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute() {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
