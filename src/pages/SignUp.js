import React, { useState } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import Layout from '../components/Layout/Layout'
import { BsGoogle } from "react-icons/bs";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import logo from "../images/logo1.png"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confpassword: "",
  });
  const { name, email, password, confpassword } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  var isWarned = false;
  const onSubmitHndler = async (e) => {
    e.preventDefault();
    if(formData.password.length < 6){
      toast.error("Password at least 6 character long !!");
      navigate("/signup");
    } 
    else
    {
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
          confpassword
        );
        const user = userCredential.user;
        updateProfile(auth.currentUser, { displayName: name });
        if (formData.password != formData.confpassword) {
          toast.error("Password doesn't match !!");
          navigate("/signup");
        }
        else {
          const formDataCopy = { 
            ...formData,
            isWarned,
          };
          delete formDataCopy.password;
          formDataCopy.timestamp = serverTimestamp();
          await setDoc(doc(db, "users", user.uid), formDataCopy);
          toast.success("Signup Successfully !");
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
      }
    }
  };

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
            <form onSubmit={onSubmitHndler}>
              <div>
                <div className="d-flex align-items-center mb-2 pb-1">
                  <div className="logo-image">
                    <img src={logo} className="logo img-fluid" />
                  </div>

                  <span className="h1 fw-bold mb-0">TheBidSpot</span>
                </div>
                <h5
                  className="fw-normal mb-2 pb-3"
                  style={{ letterSpacing: 1 }}
                >
                  Sign Up into your account
                </h5>
              </div>

               {/* Name input */}
              <div className="form-outline mb-2">
                <input
                  type="text"
                  id="name"
                  className="form-control form-control-lg"
                  value={name}
                  onChange={onChange}
                  aria-describedby="nameHelp"
                />
                <label className="form-label" htmlFor="form1Example13">
                  User name
                </label>
              </div> 
              {/* Email input */}
              <div className="form-outline mb-2">
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={onChange}
                  aria-describedby="emailHelp"
                />
                <label className="form-label" htmlFor="form1Example13">
                  Email address
                </label>
              </div>
              {/* Password input */}
              <div className="form-outline mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  id="password"
                  className="form-control form-control-lg"
                  onChange={onChange}
                />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label" htmlFor="form1Example23">
                    Password
                  </label>
                </div>
              </div>
              {/* Confirm Password input */}
              <div className="form-outline mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confpassword}
                  id="confpassword"
                  className="form-control form-control-lg"
                  onChange={onChange}
                />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label" htmlFor="form1Example23">
                    Confirm Password
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block w-100"
              >
                Sign up
              </button>
              <div className="mt-2">
                <span>already have an account?</span>{" "}
                <Link to="/signin">Sign In</Link>
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

export default SignUp;
