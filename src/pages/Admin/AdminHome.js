import React from 'react'
import { useLocation } from 'react-router-dom'
import AdmimLayout from '../../components/Layout/AdminLayout.js'
import AdminItems from './AdminItems'
import AdminUsers from './AdminUsers'


const AdminHome = () => {

  const location = useLocation();

  var showContent = true;

  return (
    <AdmimLayout>
      
      {
        location.pathname=="/admin/items" && <AdminItems/> 
      }
      {
        location.pathname=="/admin/users" &&  <AdminUsers/>
      }
    </AdmimLayout>
  )
}

export default AdminHome