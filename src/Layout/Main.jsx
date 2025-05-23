import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Component/Navbar/Navbar'
import Footer from '../Component/Footer/Footer'

const Main = () => {
  const location=useLocation()
  const noHeaderFooter = location.pathname.includes("login") || location.pathname.includes("signup")
  return (
    <div>
      {noHeaderFooter || <Navbar/>}
      <Outlet/>
 { noHeaderFooter ||    <Footer/>
  }  </div>
  )
}

export default Main
