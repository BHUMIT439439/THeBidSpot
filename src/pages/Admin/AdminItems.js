
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { firestore } from 'firebase/app';
import 'firebase/firestore';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  startAfter,limit,onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import AdminItemCard from "./AdminItemCard";
import useAuthState from "../../hooks/useAuthState";


const AdminItems = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  const [filteredListing, setFilteredListing] = useState([]);

  const param = useParams();
  
  const auth = getAuth();
  let { loggedIn } = useAuthState();
  var currentEmail = null;
  if(loggedIn)
  {
    currentEmail = auth.currentUser.email;
  }

 const getAllItems = async () =>{
  const listingsRef = collection(db, "items");
  const q = query(
    listingsRef,
    
  );
  const querySnapshot = await getDocs(q);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastFetchListing(lastVisible);
    const items = [];
    querySnapshot.forEach((doc) => {
        items.push({id: doc.id,data: doc.data()});
    });
    setListing(items);
    setLoading(false);
  });  
  };

  useEffect(()=>{   getAllItems();
},[])
  
 //loadmore pagination func
 const fetchLoadMoreListing = async () => {
  try {
    //refrence
    const listingsRef = collection(db, "items");
    //query
    const q = query(
      listingsRef,
      where("useRef", "!=", auth.currentUser.uid),
      startAfter(lastFetchListing),
      limit(8)
    );
    //execute query
    const querySnap = await getDocs(q);
    const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    setLastFetchListing(lastVisible);
    const listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListing((prevState) => [...prevState, ...listings]);
    setLoading(false);
  } catch (error) {
    console.log(error);
    toast.error("Unble to fetch data");
  }


};
//delete handler
const onDelete = async (listingId) => {
  if (window.confirm("Are You Sure  want to delete ?")) {
    // await deleteDoc(doc, (db, "listings", listingId));
    const docRef = doc(db, "items", listingId);
    await deleteDoc(docRef)
    const updatedListings = listing.filter(
      (listing) => listing.id !== listingId
    );
    setListing(updatedListings);
    toast.success("Listing Deleted Successfully");
  }
};
  return (
    <>
        <div className="mt-2 container-fluid" >
        {loading ? (
          <Spinner />
        ) : listing && listing.length > 0 ? (
          <>
          <div className="text-center container py-3">
    <h4 className="mt-4 mb-3"><strong>Manage Items for bidding !</strong></h4>
    
            <div className="row"> 
            {listing.map((list) => (
                <AdminItemCard listing={list.data} 
                id={list.id} 
                key={list.id} 
                onDelete={() => onDelete(list.id)}
                 />
              ))}
            </div>
            </div>
          </>
        ) : (
          <p>No Listing For </p>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-center mb-4 mt-4">
        {lastFetchListing && (
          <button
            className="btn btn-primary text-center"
            onClick={fetchLoadMoreListing}
          >
            load more
          </button>
        )}
      </div>
    </>
  )
}

export default AdminItems