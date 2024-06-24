import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SupabaseProvider } from './integrations/supabase/client.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>,
)
