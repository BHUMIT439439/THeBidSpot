import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import useAuthState from "../../hooks/useAuthState";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/HeaderStyles.css"
import logo from"../../images/logo11.png"
import { useMediaQuery } from 'react-responsive';

const HomeHeader = () => {
  
  //const account = JSON.parse(localStorage.getItem('checkauth'));
  const navigate = useNavigate();
  const auth = getAuth();
  let { loggedIn } = useAuthState();
  let name=null;
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  
  if(loggedIn)
  {
    name = auth.currentUser.displayName;
  }

  const logoutHandler = () => {
    //localStorage.removeItem('checkauth');
    auth.signOut();
    toast.success("Successfully Logout");
    navigate("/");
  };


  return (
    <>
      <nav className={"navbar navbar-expand-lg navbar-dark py-4"}  id="mynav">
        <div className="container d-flex justify-content-between">
          <div className="d-flex flex-row text-primary">
            <span className="fs-3 fw-bold">TheBidSpot</span>
          </div>

          <div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon bg-primary"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-item nav-link active text-dark" to={"/"}>Home</Link>
              <a className="nav-item nav-link active text-dark" href="#category">Categories</a>
              <a className="nav-item nav-link active text-dark" href="#ContactUsHome">Contact Us</a>
              
              {
                isMobile ?(
                  <>
                  {
                    loggedIn ?(
                      <>
                      <Link className="nav-item nav-link active text-dark" to={"/profile"}>Profile</Link>
                      <Link className="nav-item nav-link active text-dark"  onClick={logoutHandler}>Sign Out</Link>
                      </>
                    )
                    :(
                      <>
                      <Link className="nav-item nav-link active text-dark" to={"/signin"}>Sign In</Link>
                      </>
                    )
                  }
                  </>
                )
                :(
                  <>
                  {loggedIn ? (
                <>
                <div className="dropdown  px-4">
                  <div className='d-flex nameLogoDrawer' data-bs-toggle="dropdown" aria-expanded="false">
                    <div  id="profileImage">{name.charAt(0).toUpperCase()}</div>
                    <div className='m-auto px-2 text-white fw-bold'><span className='text-body'>{name}</span></div>
                    <i className="fa-sharp fa-solid fa-caret-down m-auto px-1 text-dark"></i>
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item text-dark" href="/profile">Profile</a></li>
                    <li><Link className="dropdown-item" onClick={logoutHandler}>Sign out<span className="fa-solid fa-right-from-bracket px-1"></span></Link></li>
                  </ul>
                </div>
               </>   
              ) 
              :(<><Link className="nav-item nav-link active text-dark" to={"/signup"}><span className="fa-solid fa-user-plus px-1"></span>Sign Up</Link>
              <Link className="nav-item nav-link active text-dark " to={"/signin"}><span className="fa-solid fa-right-to-bracket px-1"></span>Login</Link></>)
              }
                  </>
                )
              }
              
            </div>
          </div>
          </div>
        </div>
      </nav>
 
    </>
  );
};

export default HomeHeader