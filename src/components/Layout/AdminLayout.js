import React from 'react'
import Footer from './Footer'
import Header from './Header'
import AdminHeader from './AdminHeader.js'

const AdminLayout = ({children}) => {
  return (
    <>
        <AdminHeader/>
        <div style={{minHeight:"80vh"}}>
            {children}
        </div>
        <Footer/>
    </>
  )
}

export default AdminLayout