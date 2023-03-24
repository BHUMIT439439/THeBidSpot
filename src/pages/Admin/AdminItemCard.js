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
import { db } from "../../firebase.config";

  import "../../styles/ItemCardStyle.css";
  import AOS from 'aos';
  import 'aos/dist/aos.css';
import Timer from "../../components/Timer";
import { useNavigate, Link } from "react-router-dom";

const AdminItemCard = ({ listing, id, onDelete, onEdit }) => {

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
      <h5 className="card-title">{listing.itemName}</h5>
      <p className="card-text text-start">{listing.itemDec}</p>
      <p className="card-text text-start fw-bold"><span>Current price: </span>{listing.currentPrice}</p>
      {
        <>
        <Timer duration={duration} setBidTimeOut={setBidTimeOut}/>
        {bidTimeOut==false && <button className="btn btn-outline-success  mt-2 w-100 disabled">Auction running</button> }
        {bidTimeOut && <button className="btn btn-outline-secondary  mt-2 w-100 disabled">Auction ended</button> }
        <button className="btn btn-outline-danger  mt-2 w-100" onClick={()=>{onDelete(listing.id)}}>Delete</button>
        </>
      }
      
    </div>
  </div>
</div>


    </>
  );
};

export default AdminItemCard;