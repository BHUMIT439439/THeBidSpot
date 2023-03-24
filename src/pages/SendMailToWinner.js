import React, { useState,useEffect,useRef } from 'react'
import emailjs from "@emailjs/browser";
import {
    doc,
    updateDoc,
    getDoc,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "../firebase.config";
  import { useNavigate, Link, useParams } from "react-router-dom";
  import { toast } from "react-toastify";
  import Layout from "../components/Layout/Layout";
  import p1 from "../../src/images/mailToWinner.avif"
const SendMailToWinner = () => {

  const params = useParams();

    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemOwner, setItemOwner] = useState("");
    const [itemWinner, setItemWinner] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'items', params.itemId), (doc) => {
          if (doc.exists()) {
            setItemName(doc.data().itemName);
            setItemPrice(doc.data().currentPrice);
            setItemOwner(doc.data().email);
            setItemWinner(doc.data().currentBidder);
          }
        });
    
        return () => unsubscribe();
      }, [params.itemId]);


      const form = useRef();
      // useEffect(()=>{

        
            // emailjs
            //   .sendForm(
            //     "service_zql4d2d",
            //     "template_hqyovk7",
            //     form.current,
            //     "g3ozdSlWfP8AlCfjG"
            //   )
            //   .then(
            //     (result) => {
            //       console.log(result.text);
                
            //     },
            //     (error) => {
            //       console.log(error.text);
            //     }
            //   );
       
        
      // })

      const sendEmail = (e) => {
        e.preventDefault();

        emailjs
              .sendForm(
                "service_zql4d2d",
                "template_hqyovk7",
                form.current,
                "g3ozdSlWfP8AlCfjG"
              )
              .then(
                (result) => {
                  console.log(result.text);
                  toast.success("Mail sent to winner");
                
                },
                (error) => {
                  console.log(error.text);
                }
              );
      }


  
  return (
    <Layout>
      <div className="row profile-container">
        <div className="col-md-5 profile-container-col1">
          <img src={p1} alt="profile" />
        </div>
        <div className="col-md-6 profile-container-col2">
          <div className="card">
            <div className="card-header">
                <p className='mt-2'>Verify, This details are shown in mail... </p>
            </div>
            <div className="card-body">
            <form ref={form} onSubmit={sendEmail} >
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Item Name
                  </label>
                  <input className="form-control"  type="text" defaultValue={itemName} name="item_name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Item price
                  </label>
                  <input className="form-control" type="text" defaultValue={itemPrice} name="item_price" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Seller
                  </label>
                  <input className="form-control" type="text"  defaultValue={itemOwner} name="owner_email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Winner
                  </label>
                  <input className="form-control" type="text"  defaultValue={itemWinner} name="to_email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Message
                  </label>
                  <textarea className="form-control" rows={3} placeholder="optional" defaultValue={""} name="message" />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-outline-primary btn-block w-100">SEND MAIL</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SendMailToWinner