import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

  import "../styles/ItemCardStyle.css";
  import AOS from 'aos';
  import 'aos/dist/aos.css';
import Timer from "./Timer";


const ItemCard = ({ listing, id, onDelete, onEdit }) => {

  const auth = getAuth();
  const [bidTimeOut, setBidTimeOut] = useState(false);
  const [price,setPrice] = useState(listing.startPrice);

  // const tempDuration = (new Date() - listing.timestamp.toDate());
  // const auctionDuration = listing.ItemDuration*60*60*1000; 
  // const duration = auctionDuration - tempDuration;
  // const duration = 15000;

  
  const auctionDuration = listing.ItemDuration*60*60*1000; 
  const tempDuration = (listing.timestamp.toMillis()+auctionDuration);
  const duration = tempDuration-Date.now();


  useEffect(() => {
    AOS.init({});
  }, [])


  const BidHandler = async(listingId)=>{
    console.log(listingId)
    const docRef = doc(db, "items", listingId);
    const docSnap = await getDoc(docRef);
    const newPrice = parseInt(docSnap.data().startPrice)+100;
    const data = {
      startPrice: newPrice,
      currentBidder : auth.currentUser.email
    };
    await updateDoc(docRef, data);
    setPrice(newPrice);
    toast.success("Bidding Done!!");
    
    

  }

  return (
    <>
      <div className="col-sm-3">
  <div className="card mt-4 card-item">
  <img src={listing.imgUrls[0]} className="card-img-top img-fluid" alt="..." style={{height:"250px"}} data-aos-delay={300} />
    <div className="card-body">
      <h5 className="card-title">{listing.itemName}</h5>
      <p className="card-text text-start">{listing.itemDec}</p>
      <p className="card-text text-start fw-bold"><span>Current price: </span>{price}</p>
      <p className="card-text text-start"><span>Contact: </span>{listing.email}</p>
      {
        listing.useRef != auth.currentUser.uid 
        ? (
          <>
          <Timer duration={duration} setBidTimeOut={setBidTimeOut}/>
          {
            bidTimeOut
              ?(
                listing.currentBidder=="" 
                ?(<button className="btn btn-secondary w-100 disabled">UN SOLD</button>)
                :(<button className="btn btn-success w-100 disabled">SOLD</button>)
              )
              :(<button className="btn btn-outline-primary w-100" onClick={() => {BidHandler(id)}}>BID</button>)
          }
          </>
        )
        :(
        <>
        <div className="d-flex justify-content-around">
        <button className="btn btn-outline-secondary" onClick={()=>{onEdit(listing.id)}} >Edit</button>
        <button className="btn btn-outline-danger" onClick={()=>{onDelete(listing.id)}}>Delete</button>
        </div>
        </>
        )
      }
      
    </div>
  </div>
</div>


    </>
  );
};

export default ItemCard;