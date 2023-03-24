import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from '../components/Layout/Layout'
import Spinner from "../components/Spinner";
import { firestore } from 'firebase/app';
import 'firebase/firestore';
import {collection, getDocs,query,where} from 'firebase/firestore'
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import ItemCard from "../components/ItemCard";


const AuctionNow = () => {
  const [listing, setListing] = useState("");
  const [loading, setLoading] = useState(true);
  const param = useParams();
  const auth = getAuth();
  const currentEmail = auth.currentUser.email;

  useEffect(()=>{
    const fetchListing = async () => {
      try {
        const listingsRef = collection(db, "items");
        const q = query(
          listingsRef,
          where("useRef", "!=", auth.currentUser.uid),
          );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListing(listings);
        setLoading(false);
        //console.log(listing[0])
      }catch (error) {
        console.log(error);
        toast.error("Unble to fetch data");
      }
    };
    //func call
    fetchListing();
  },[])

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

    </Layout>
  )
}

export default AuctionNow