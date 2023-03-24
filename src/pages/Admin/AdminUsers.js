import React, { useState, useEffect,useRef } from "react";
import { toast } from "react-toastify";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import emailjs from "@emailjs/browser";
import { getAuth } from "firebase/auth";

const AdminUsers = () => {

  var to_user_email = null;
  const [userListings, setUserListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchUserListings = async () => {
      const usersRef = collection(db, "users");
        const q = query(usersRef,where("email", "!=", "onlineauctionappadm123@gmail.com"));
      const querySnap = await getDocs(q);
     

      onSnapshot(q,(querySnap)=>{
        let users = [];
        querySnap.forEach((doc) => {
          users.push({id: doc.id,data: doc.data()});
        });
        setUserListings(users);
        setLoading(false);
      });

      
      
      // querySnap.forEach((doc) => {
      //   return users.push({
      //     id: doc.id,
      //     data: doc.data(),
      //   });
      // });
     
      // setUserListings(users);
      
      // setLoading(false);
    };
    fetchUserListings();
  }, []);
  //console.log(userListings)

//delete handler
const onDelete = async (userId) => {
  if (window.confirm("Are You Sure  want to delete ?")) {
    // await deleteDoc(doc, (db, "listings", listingId));
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef)
    const updatedUserListings = userListings.filter(
      (user) => user.id !== userId
    );
    setUserListings(updatedUserListings);
    toast.success("User Deleted Successfully");
  }
};

//send warning mail to user
const form = useRef();
const sendWarningEmail = async (email,username,userId) => {
 
  var templateParams = {
    to_user: email,
    to_username: username
};
  emailjs
        .send(
          "service_r93jsnq", //service id for admin
          "template_ew30imx", // template id for admin
          templateParams,
          "n_02KVLkxAeOgYGCO" //publkic key for admin
        )
        .then(
          (result) => {
            console.log(result.text);
            toast.success("Warning sent to user");
          
          },
          (error) => {
            console.log(error.text);
          }
          );
        
        // update users database with warning is send or not
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { isWarned:true });
}
const data= async (userId)=>{
  console.log(userId);
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data())
  to_user_email = docSnap.data().email;
  
}
  return (
    <>
    <div className="container">
   <div className="row">
     <div className="col-md-12">
         <div className="table-responsive">
    <table className="table table-hover mt-3 w-100">
    <thead className="table-light">
      <tr>
        <th scope="col">Index</th>
        <th scope="col">Name</th>
        <th scope="col">Email address</th>
        <th scope="col">Warning to user</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      
      {
        userListings!=null && userListings.map((list,index)=>{
          return(
            <tr key={index}>
              <th scope="row">{index+1}</th>
              <td>{list.data.name}</td>
              <td >{list.data.email}</td>
              <td>
                {
                  list.data.isWarned==false && <button type="submit" className="btn btn-outline-warning" onClick={()=>{sendWarningEmail(list.data.email,list.data.name,list.id)}}>send warning</button>
                }     
                  {
                    list.data.isWarned && <button className="btn btn-secondary" disabled>Warning sent</button>
                }
              </td>
              <td><button className="btn btn-outline-danger" onClick={()=>{onDelete(list.id)}}>Delete</button></td>
            </tr>
          );
        })
      }
      </tbody>
      </table>
      </div>
      </div>
      </div>
      </div>
    </>
  )
}

export default AdminUsers