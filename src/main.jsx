import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import CareCardPage from './pages/CareCardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LogActivityPage from './pages/LogActivityPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SearchCareCardPage from './pages/SearchCareCardPage.jsx'
import VisitHistoryPage from './pages/VisitHistoryPage.jsx'
import theme from './theme'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/home',
                        element: <HomePage />,
                    },
                    {
                        path: '/search-carecard',
                        element: <SearchCareCardPage />,
                    },
                    {
                        path: '/visit-history',
                        element: <VisitHistoryPage />,
                    },
                    {
                        path: '/carecard/:id',
                        element: <CareCardPage />,
                    },
                    {
                        path: '/log-activity/:id',
                        element: <LogActivityPage />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <App />,
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
)
