import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header'
import './styles/header.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Home from './pages/Home'
import YourSnippets from './pages/YourSnippets'
import AddSnippet from './pages/AddSnippet'
import ProtectedRoutes from './components/ProtectedRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route index element={<LoginPage />}/>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signUp' element={<SignUpPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/home' element={<Home />} />
          <Route path='/yourSnippets' element={<YourSnippets />} />
          <Route path='/addSnippet' element={<AddSnippet />} />
        </Route>
      </Routes>
    </>
  )
}

export default App