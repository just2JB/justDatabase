import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/global.css'
import './styles/study-ui.css'
import './styles/diagram-motion.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
