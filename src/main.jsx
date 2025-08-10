import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('>>> main.jsx executing');  // should appear in DevTools console
alert('main.jsx loaded');               // temporary test; you should see an alert

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
