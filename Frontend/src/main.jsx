import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/index.store.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <Provider store={store}>
    {/* Redux-Persist temporarily disabled to fix stack overflow issues */}
    {persistor ? (
      <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
    ) : (
      <App />
    )}
    </Provider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)


