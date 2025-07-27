import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import './App.css'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import '@fontsource/roboto'; 

import Header from './components/Header/Header.jsx'

const router= createBrowserRouter(
  createRoutesFromElements(
      <Route path='/'>
        <Route element={<Layout />}>
          <Route index element={<Home />}/>
        </Route>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
      </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
