import React, { useState } from "react";
import { toast } from 'react-toastify';
import {getAuth, signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
 import { BsArrowLeftCircleFill } from "react-icons/bs";
 import { BsGoogle } from "react-icons/bs";
 import { RiAuctionFill } from "react-icons/ri";
import "../styles/SignInStyle.css"
import logo from "../images/logo1.png"


const SignIn = () => {
    
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //loginHandler
  const loginHandler = async (e) => {
    e.preventDefault() 
    try{
        
        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth,email,password)
        //localStorage.setItem("checkauth",JSON.stringify({'email':email}))
        if(userCredential.user){
            toast.success("Login Successfully !")
            navigate('/')
        }
    }
    catch(error)
    {
        console.log(error)
        toast.error("Invalid Email Or Password")
    }
  }

  const onGoolgleAuthHandler = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Problem With Google Auth ");
    }
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={loginHandler}>
              <div>
              <a href="/"><BsArrowLeftCircleFill/><span className="pt-2">Back to home</span></a>
                <div className="d-flex align-items-center mb-3 pb-1 pt-5">
                  <div className="logo-image ">
                    <img src={logo} className="logo img-fluid" />
                  </div>

                  <span className="h1 fw-bold mb-0 ">TheBidSpot</span>
                </div>
                <h5
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: 1 }}
                >
                  Sign into your account
                </h5>
              </div>

              {/* Email input */}
              
              <label className="form-label" htmlFor="form1Example13">
                  Email address
                </label>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={onChange}
                  aria-describedby="emailHelp"
                />
                <span className="text-muted">We'll never share your email with anyone else.</span>

              </div>
              {/* Password input */}
              <label className="form-label" htmlFor="form1Example23">
                    Password
                  </label>
              <div className="form-outline mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  id="password"
                  className="form-control form-control-lg"
                  onChange={onChange}
                />
                <div className="d-flex justify-content-end mb-4">
                  <Link to="/forgot-password">forgot Password</Link>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block w-100"
              >
                Sign in
              </button>
              <div className="mt-2">
                <span>Don't have an account?</span>{" "}
                <Link to="/signup">Sign up</Link>
              </div>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>
              <div>
                <a
                  className="btn btn-primary btn-lg btn-block w-100"
                  style={{ backgroundColor: "#3b5998" }}
                  onClick={onGoolgleAuthHandler}
                  role="button"
                >
                  <BsGoogle className="me-2" />
                  Continue with Google
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;