import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './routes/Dashboard'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }
`;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
