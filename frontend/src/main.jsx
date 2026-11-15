import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { ListingsProvider } from './context/ListingsContext.jsx'
import { EnquiriesProvider } from './context/EnquiriesContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <ListingsProvider>
              <EnquiriesProvider>
                <App />
              </EnquiriesProvider>
            </ListingsProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
