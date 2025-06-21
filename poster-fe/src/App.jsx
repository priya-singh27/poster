import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Login from './components/LoginForm'
import Home from './components/Home'
import NewPost from './components/NewPost'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path='/new-post' element={
          <ProtectedRoute>
            <NewPost/>
          </ProtectedRoute>
        }/>
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>

      </Routes>
    </Router>
  )
}

export default App
