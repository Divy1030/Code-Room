import React from 'react'
import { BrowserRouter,Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import Project from '../Pages/Project'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/project/:projectId' element={<Project />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes