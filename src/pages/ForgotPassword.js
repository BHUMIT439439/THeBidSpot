import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
//import "../styles/ForgotPasswordStyle.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
      navigate("/signin");
    } catch (error) {
      toast.error("Somthing went wrong");
    }
  };
  return (
    
      // <div className="container mt-4">
      //   <h1>Reset Your Password</h1>
      //   <form onSubmit={onSubmitHandler}>
      //     <div className="container mb-3">
      //       <label htmlFor="exampleInputEmail1" className="form-label">
      //         Email address
      //       </label>
      //       <input
      //         type="email"
      //         value={email}
      //         onChange={(e) => setEmail(e.target.value)}
      //         className="form-control"
      //         id="exampleInputEmail1"
      //         aria-describedby="emailHelp"
      //       />
      //       <div id="emailHelp" className="form-text">
      //         We'll never share your email with anyone else.
      //       </div>
      //     </div>
      //     <div className="d-flex justify-content-between">
      //       <button type="submit" className="btn btn-primary">
      //         reset
      //       </button>
      //       <Link to="/signin">Sing In</Link>
      //     </div>
      //   </form>
      // </div>
   
      
<div className="container  mt-5">
  <div className="row justify-content-center">
    <div className="col-lg-8 col-md-10">
      <h2>Forgot your password?</h2>
      <p>Change your password in three easy steps. This helps to keep your new password secure.</p>
      <ol className="list-unstyled">
        <li><span className="text-primary text-medium">1. </span>Fill in your email address below.</li>
        <li><span className="text-primary text-medium">2. </span>We'll email you a temporary code.</li>
        <li><span className="text-primary text-medium">3. </span>Use the code to change your password on our secure website.</li>
      </ol>
      <form className="card mt-4" onSubmit={onSubmitHandler}>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="email-for-pass">Enter your email address</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email-for-pass" required /><small className="form-text text-muted">Type in the email address you used when you registered. Then we'll email a code to this address.</small>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary" type="submit">Get New Password</button>
        </div>
      </form>
    </div>
  </div>
</div>



  );
};

export default ForgotPassword;