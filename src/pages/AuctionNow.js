import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from '../components/Layout/Layout'
import Spinner from "../components/Spinner";
import { firestore } from 'firebase/app';
import 'firebase/firestore';
import {collection, getDocs,query,where, startAfter,limit,onSnapshot} from 'firebase/firestore'
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import ItemCard from "../components/ItemCard";


const AuctionNow = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  const [filteredListing, setFilteredListing] = useState([]);

  const param = useParams();
  const auth = getAuth();
  const currentEmail = auth.currentUser.email;

  // useEffect(()=>{
  //   const fetchListing = async () => {
  //     try {
  //       const listingsRef = collection(db, "items");
  //       const q = query(
  //         listingsRef,
  //         where("useRef", "!=", auth.currentUser.uid),
  //         limit(8),
  //         );
  //       const querySnap = await getDocs(q);
  //       const lastVisible = querySnap.docs[querySnap.docs.length - 1];
  //       setLastFetchListing(lastVisible);
  //       const listings = [];
  //       querySnap.forEach((doc) => {
  //         return listings.push({
  //           id: doc.id,
  //           data: doc.data(),
  //         });
  //       });
  //       setListing(listings);
  //       setLoading(false);
  //       //console.log(listing[0])
  //     }catch (error) {
  //       console.log(error);
  //       toast.error("Unble to fetch data");
  //     }
  //   };
  //   //func call
  //   fetchListing();
  // },[])

 const getAllItems = async () =>{
  const listingsRef = collection(db, "items");
  const q = query(
    listingsRef,
    where("useRef", "!=", auth.currentUser.uid),limit(8),
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

  useEffect(()=>{
    getAllItems();
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

  return (
    <Layout>
        <div className="mt-2 container-fluid" >
        {loading ? (
          <Spinner />
        ) : listing && listing.length > 0 ? (
          <>
          <div className="text-center container py-3">
    <h4 className="mt-4 mb-3"><strong>Choose your item for Bidding !</strong></h4>
    
            <div className="row"> 
            {listing.map((list) => (
                <ItemCard listing={list.data} id={list.id} key={list.id} />
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
    </Layout>
  )
}

export default AuctionNow