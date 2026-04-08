import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './tailwind_import.css'

import Login          from './pages/Login.jsx'
import Register       from './pages/Register.jsx'
import Dashboard      from './pages/Dashboard.jsx'
import NotFound       from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute    from './components/PublicRoute.jsx'
import Profiles       from './pages/Profiles.jsx'
import NewProfile     from './pages/NewProfile.jsx'
import Account from './pages/Account.jsx'

const router = createBrowserRouter([
    { path: '/',                element: <Navigate to="/login" replace /> },
    { path: '/login',           element: <PublicRoute>      <Login />       </PublicRoute>      },
    { path: '/register',        element: <PublicRoute>      <Register />    </PublicRoute>      },
    { path: '/dashboard',       element: <ProtectedRoute>   <Dashboard />   </ProtectedRoute>   },
    { path: '/profiles',        element: <ProtectedRoute>   <Profiles />    </ProtectedRoute>   },
    { path: '/profiles/new',    element: <ProtectedRoute>   <NewProfile />  </ProtectedRoute>   },
    { path: '/account', element: <ProtectedRoute><Account /></ProtectedRoute> },
    { path: '*',                element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)