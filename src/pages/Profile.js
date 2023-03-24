import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import { FaEdit, FaArrowAltCircleRight } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { MdDoneOutline } from "react-icons/md";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import ItemCard from "../components/ItemCard";
import "../styles/ProfileStyle.css";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import p1 from "../images/p1.avif";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  //useeffect for getting data
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "items");
        const q = query(
          listingsRef,
          where("useRef", "==", auth.currentUser.uid),
          );
      const querySnap = await getDocs(q);
      console.log(querySnap);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      console.log(listings);
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const logoutHandler = () => {
    auth.signOut();
    toast.success("Successfully Logout");
    navigate("/signin");
  };

  //onChange
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  //submit handler
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { name });
        toast.success("User Updated!");
        setTimeout(function(){
          window.location.reload();
       }, 4000);
      }
    } catch (error) {
      console.log(error);
      toast("Something Went Wrong");
    }
  };

  //delete handler
  const onDelete = async (listingId) => {
    if (window.confirm("Are You Sure  want to delete ?")) {
      // await deleteDoc(doc, (db, "listings", listingId));
      const docRef = doc(db, "items", listingId);
      await deleteDoc(docRef)
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Listing Deleted Successfully");
    }
  };
  //edit handler
  const onEdit = (listingId) => {
    //console.log("-----------"+ listingId)
    navigate(`/edit-item/${listingId}`);
  };


  return (
    <Layout>
      <div className="row profile-container">
        <div className="col-md-6 profile-container-col1">
          <img src={p1} alt="profile" />
        </div>
        <div className="col-md-6 profile-container-col2">
          <div className="container mt-4  d-flex justify-content-between">
            <h2>Profile Details</h2>
            <button className="btn btn-danger" onClick={logoutHandler}>
              Logout
            </button>
          </div>
          <div className="   mt-4 card">
            <div className="card-header">
              <div className="d-flex justify-content-between ">
                <p>Your Personal Details </p>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((prevState) => !prevState);
                  }}
                >
                  {changeDetails ? (
                    <MdDoneOutline color="green" />
                  ) : (
                    <FaEdit color="red" />
                  )}
                </span>
              </div>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={onChange}
                    disabled={!changeDetails}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    onChange={onChange}
                    disabled
                  />
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-3 create-listing">
          <a href="auction-now"><BsArrowLeftCircleFill/><span className="p-1">Take part in Auction</span></a>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4 your-listings">
      {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
          <div className="text-center container py-3">
    <h3>Your Listing !</h3>
    
            <div className="row"> 
              {listings.map((list) => (
                <ItemCard listing={list.data} 
                          id={list.id} 
                          key={list.id} 
                          onDelete={() => onDelete(list.id)}
                          onEdit={() => onEdit(list.id)}
                  />
              ))}
            </div>
            </div>
          </>
        ) : (
          <p>No Listing For </p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;