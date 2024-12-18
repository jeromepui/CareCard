import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ProtectedRoute from '../components/ProtectedRoute'
import { ROUTES } from '../constants'
import CareCardPage from '../pages/CareCardPage'
import HomePage from '../pages/HomePage'
import LogActivityPage from '../pages/LogActivityPage'
import LoginPage from '../pages/LoginPage'
import SearchCareCardPage from '../pages/SearchCareCardPage'
import VisitHistoryPage from '../pages/VisitHistoryPage'
import SignupPage from '../pages/SignupPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'

const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <App />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
            {
                path: ROUTES.SIGNUP,
                element: <SignupPage />,
            },
            {
                path: ROUTES.FORGOT_PASSWORD,
                element: <ForgotPasswordPage />,
            },
            {
                path: ROUTES.RESET_PASSWORD,
                element: <ResetPasswordPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <HomePage />,
                    },
                    {
                        path: ROUTES.SEARCH,
                        element: <SearchCareCardPage />,
                    },
                    {
                        path: ROUTES.VISIT_HISTORY,
                        element: <VisitHistoryPage />,
                    },
                    {
                        path: ROUTES.CARECARD,
                        element: <CareCardPage />,
                    },
                    {
                        path: ROUTES.LOG_ACTIVITY,
                        element: <LogActivityPage />,
                    },
                ],
            },
        ],
    },
])

export default router
