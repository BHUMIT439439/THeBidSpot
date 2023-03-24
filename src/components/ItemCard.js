import React,{useEffect,useState} from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import {
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  addDoc, collection,getDocs,query,where,limit,orderBy,deleteDoc,setDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

  import "../styles/ItemCardStyle.css";
  import AOS from 'aos';
  import 'aos/dist/aos.css';
import Timer from "./Timer";
import { useNavigate, Link } from "react-router-dom";

const ItemCard = ({ listing, id, onDelete, onEdit }) => {

  const auth = getAuth();
  const navigate = useNavigate();
  const basePrice = listing.startPrice;
  const [bidTimeOut, setBidTimeOut] = useState(false);
  const [price,setPrice] = useState(listing.startPrice);
  const [currentWinner,setCurrentWinner] = useState("");
  let newCurrentPrice = listing.currentPrice;
  const auctionDuration = listing.ItemDuration*60*60*1000; 
  const tempDuration = (listing.timestamp.toMillis()+auctionDuration);
  const duration = tempDuration-Date.now();


  useEffect(()=>{
    AOS.init({});
    (async () => {
      
      const fetchBidsRef = collection(db,"bids");
      const q = query(fetchBidsRef,where("itemId", "==", id),orderBy("price","desc"),limit(1));
      
      const querySnapshot = await getDocs(q);
      onSnapshot(q, (querySnapshot) => {
      
        querySnapshot.forEach(async (doc) => {
          if(doc.exists())
          {
            setPrice(doc.data().price);
            setCurrentWinner(doc.data().email);
          }
        });
      });
    })();
  })



  const BidHandler = async(listingId)=>{
    // console.log(listingId)
    const docRef = doc(db, "items", listingId);
    const docSnap = await getDoc(docRef);
    const newPrice = parseInt(docSnap.data().currentPrice)+100;
    const data = {
      currentPrice: newPrice,
      currentBidder : auth.currentUser.email
    };
    await updateDoc(docRef, data);

    const bidsRef = collection(db, "bids");
    const bidData = {
      price: newPrice,
      email: auth.currentUser.email,
      itemId: listingId,
    };
    await addDoc(bidsRef, bidData); // add the bid to the "bids" collection
    toast.success("Bidding Done!!");
    
  }

  const clickOptOut = async (listingId)=>{
    const itemRef1 = collection(db, "items");
    const docRef = collection(db,"bids");
    const q = query(docRef,where("itemId", "==", listingId),orderBy("price","desc"),limit(2));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.size < 2)
    {
      newCurrentPrice = basePrice;
      
        await updateDoc(doc(itemRef1, listingId), {
          currentBidder: "",
        });
    
    }
    else
    {
      
      newCurrentPrice = querySnapshot.docs[1].data().price;
    }
    deleteDoc(querySnapshot.docs[0].ref);

    const itemRef = doc(db, "items", listingId);
    await updateDoc(itemRef, {currentPrice: newCurrentPrice});
    toast.success("You withdrawn your bid Successfully !!");


  }

  const SendMailToWinnerHandler=(itemId)=>{
    navigate(`/send-mail-to-winner/${itemId}`);
  }

  return (
    <>
      <div className="col-sm-3">
  <div className="card mt-4 card-item">
  <img src={listing.imgUrls[0]} className="card-img-top img-fluid" alt="..." style={{height:"250px"}} data-aos-delay={300} />
    <div className="card-body">
      <h5 className="card-title text-start">{listing.itemName}</h5>
      <p className="card-text text-start">{listing.itemDec}</p>
      <p className="card-text text-start fw-bold"><span>Current price: </span>{listing.currentPrice}</p>
      {
        listing.useRef != auth.currentUser.uid 
        ? (
          <>
           <div className="d-flex justify-content-between">
           {listing.currentBidder !="" && <p className="card-text text-start fw-bold">Bid by : {listing.currentBidder}</p>}
           </div>
           {bidTimeOut==false && listing.currentBidder=="" && <p className="card-text text-start">Become the first bidder!</p>}
           {bidTimeOut==true && listing.currentBidder=="" && <p className="card-text text-start">There is no any bidder</p>}
           {listing.currentBidder == auth.currentUser.email && basePrice!=listing.currentPrice && <span className="text-primary" onClick={() => {clickOptOut(id)}} style = {{cursor:'pointer'}}><u>opt-out</u></span>}
           
          <Timer duration={duration} setBidTimeOut={setBidTimeOut}/>
          {
            bidTimeOut?(
              listing.currentBidder=="" ?(<button className="btn btn-secondary w-100 disabled">UNSOLD!</button>)
              :(
                <>
                <button className="btn btn-success w-100 disabled">SOLD!</button>
                
                </>
              )
            )
            :(<button className="btn btn-outline-primary w-100" onClick={() => {BidHandler(id)}}>BID</button>)
          }
          </>
        )
        :(
        <>
        <div className="d-flex justify-content-around">
        <button className="btn btn-outline-primary" onClick={()=>{onEdit(listing.id)}} >Edit</button>
        <button className="btn btn-outline-danger" onClick={()=>{onDelete(listing.id)}}>Delete</button>
        </div>
        {bidTimeOut==false && listing.currentBidder!="" && <div><button className="btn btn-outline-success mt-2 w-100" onClick={() => {SendMailToWinnerHandler(id)}}>Send mail to winner</button></div>}
        {bidTimeOut==false && listing.currentBidder=="" && <div><button className="btn btn-outline-secondary mt-2 w-100" disabled>UNSOLD!</button></div>}
        
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