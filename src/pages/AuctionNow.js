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
  const [filteredListing, setFilteredListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  const [isFilter,setIsFilter] = useState(false);
  const [showCategory, setShowCategory] = useState("All category")

  const param = useParams();
  const auth = getAuth();
  const currentEmail = auth.currentUser.email;

 const getAllItems = async () =>{
  const listingsRef = collection(db, "items");
  const q = query(
    listingsRef,
    where("useRef", "!=", auth.currentUser.uid),limit(9),
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

const filterResult=(catItem)=>{
  setIsFilter(true);
  setShowCategory(catItem);
  if(catItem == "All Category")
  {
    setFilteredListing(listing);
  }
  else{
    const result = listing.filter((curData)=>{
      return curData.data.itemCategory==catItem;
    })
    setFilteredListing(result);
  }
  
}


  return (
    <Layout>
        <div >
        {loading ? (
          <Spinner />
        ):
        (
          <>
          
           <h4 className="text-center mt-4 mb-3"><strong>Choose your item for Bidding ! -  {showCategory}</strong></h4>
          <div className="container-fluid mx-2">
            <div className="row mt-5 mx-2"> 
            <div className="show-category col-md-3 d-none d-xl-block">
            <div class="sticky-top">
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("All Category")}> All Category </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Art")}> Art </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Furniture")}> Furniture </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Glass & Kitchenware")}> Glass & Kitchenware </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Books & Comics")}> Books & Comics </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Classis cars, Motorcycles & Automobila")}> Classis cars, Motorcycles & Automobila </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Coins & Stamps")}> Coins & Stamps </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Entertainment & Games")}> Entertainment & Games </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Fashion")}> Fashion </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Interiors & Decorations")}> Interiors & Decorations </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Jewellery & Precious Stones")}> Jewellery & Precious Stones </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Militaria & Historical documents")}> Militaria & Historical documents </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Music & Cameras")}> Music & Cameras </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Toys & Models")}> Toys & Models </button>
            <button className="btn btn-outline-primary w-100 mb-2" onClick={()=>filterResult("Watches")}> Watches </button>
            </div>
            </div>
            <div className="col-md-9">
              {
                isFilter ? (
                 filteredListing.length > 0 ?
                 ( <div className="row">
                  {filteredListing.map((list) => (
                    <ItemCard listing={list.data} id={list.id} key={list.id} />
                  ))}
                  </div>)
                 :( <div className="row">
                 <p className="text-center">No Items Found For {showCategory}</p>
                  </div>)
                ):
                (
                 listing.length > 0 ?
                 ( <div className="row">
                  {listing.map((list) => (
                    <ItemCard listing={list.data} id={list.id} key={list.id} />
                  ))}
                  </div>)
                 :( <div className="row">
                 <p className="text-center">No Any Items Found</p>
                  </div>)
                )
              }
              
              </div>
            </div>
            
            </div>
          </>
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