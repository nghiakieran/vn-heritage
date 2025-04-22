import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from '~/App.jsx'
import './index.css'
import { store } from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {
          fetch('http://localhost:8017/v1/heritages', {
            method : 'GET',
            headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => console.log(data))
        }
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
