import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import AdminHome from './pages/Admin/AdminHome'
import About from './pages/About'
import PageNotFound from './pages/PageNotFound'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import AuctionNow from './pages/AuctionNow';
import ReviewItem from './pages/ReviewItem';
import EditItem from './pages/EditItem';
import ContactUs from './pages/ContactUs';
import SendMailToWinner from './pages/SendMailToWinner';
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from "react";
import Spinner from './components/Spinner.js';
import useAuthState from "./hooks/useAuthState";

function App() {

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true);
  var isAdmin=false;

  useEffect(() => {
    setTimeout(() => setShow(true), 1000);
  }, []);
  
  let { loggedIn } = useAuthState();

  const auth = getAuth();

  if(loggedIn && show && auth.currentUser.email=="onlineauctionappadm123@gmail.com")
  {
    isAdmin=true;
  }
 


  return (
    <div>
      <BrowserRouter>
      <ToastContainer/>
      {/* {show==false && <Spinner/>} */}
      <Routes>
      {show==false  && <Route path="/" element={<Spinner />} />}
        {isAdmin && <Route path="/" element={<AdminHome />} />}
       {isAdmin==false && <Route path="/" element={<Home />} />}
        {/* <Route path="/" element={<Home />} /> */}
        
        <Route path="/admin/items" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/profile" element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} /> 
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/auction-now" element={<PrivateRoute />} >
          <Route path="/auction-now" element={<AuctionNow />} />
          <Route path="/auction-now/category/:categoryName" element={<AuctionNow />} />
        </Route>
        <Route path="/review-item/:itemId" element={<ReviewItem />} />
        <Route path="edit-item/:itemId" element={<EditItem/>} />
        <Route path="/send-mail-to-winner/:itemId" element={<SendMailToWinner />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </BrowserRouter>
        
    </div>
  );
}

export default App;
