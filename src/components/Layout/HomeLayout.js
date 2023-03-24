import React from 'react'
import Footer from './Footer'
import Header from './Header'
import HomeHeader from './HomeHeader'

const HomeLayout = ({children}) => {
  return (
    <>
        <HomeHeader/>
        <div style={{minHeight:"80vh"}}>
            {children}
        </div>
        <Footer/>
    </>
  )
}

export default HomeLayout