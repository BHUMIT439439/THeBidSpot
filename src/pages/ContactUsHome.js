import React, { useRef,useEffect } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "../styles/ContactUsStyle.css"
import c1 from "../images/c1.avif"
import AOS from 'aos';
import 'aos/dist/aos.css';

const ContactUsHome = () => {

  useEffect(() => {
    AOS.init();
  }, [])

    const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_zql4d2d",
        "template_gwfzjym",
        form.current,
        "g3ozdSlWfP8AlCfjG"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("message sent");
          var frm = document.getElementsByName('contact-form')[0];
          frm.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <>
    <div className='container' data-aos="fade-up" data-aos-delay={200}>
    <hr className="hr3" />
<div className="contact3 py-5">
  <div className="row no-gutters">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="card-shadow">
            <img src={c1} className="img-fluid" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="contact-box ml-3">
            <h1 className="font-weight-light mt-2">Quick Contact</h1>
            <form className="mt-4" ref={form} onSubmit={sendEmail} name="contact-form">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group mt-2">
                    <input className="form-control" type="text" placeholder="name" defaultValue={""} name="user_name" />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group mt-2">
                    <input className="form-control" type="email" placeholder="email address" defaultValue={""} name="user_email" />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group mt-2">
                    <input className="form-control" type="text" placeholder="phone" defaultValue={""} name="user_contact_no"/>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group mt-2">
                    <textarea className="form-control" rows={3} placeholder="message" defaultValue={""} name="message" />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button type="submit" className="btn btn-danger-gradiant mt-3 text-white border-0 px-3 py-2"><span> SUBMIT</span></button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card mt-4 border-0 mb-4">
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="card-body d-flex align-items-center c-detail pl-0">
                  <div className="m-3 align-self-center">
                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon1.png" />
                  </div>
                  <div className>
                    <h6 className="font-weight-medium">Address</h6>
                    <p className>601 Buisness Hub
                      <br /> Surat, India</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="card-body d-flex align-items-center c-detail">
                  <div className="m-3 align-self-center">
                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon2.png" />
                  </div>
                  <div className>
                    <h6 className="font-weight-medium">Phone</h6>
                    <p className>+91 8141694024
                      <br /> +91 9328180107</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="card-body d-flex align-items-center c-detail">
                  <div className="m-3 align-self-center">
                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon3.png" />
                  </div>
                  <div className>
                    <h6 className="font-weight-medium">Email</h6>
                    <p className>
                      onlineauctionapp123@gmail.com
                      <br /> onlineauctionappadm123@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>


    </>
  )
}

export default ContactUsHome