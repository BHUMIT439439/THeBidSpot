
import React,{ useEffect } from 'react'
import HomeLayout from '../components/Layout/HomeLayout'
import {Link} from 'react-router-dom'
import AddItem from "../pages/AddItem"
import "../styles/HomeStyle.css"
import hp1 from "../images/hp1.jpg"
import m1 from "../images/categoryImg/militria1.png"
import a1 from "../images/categoryImg/art1.png"
import camera1 from "../images/categoryImg/camera1.png"
import car1 from "../images/categoryImg/car1.png"
import coins1 from "../images/categoryImg/coins1.png"
import fashion1 from "../images/categoryImg/fashion1.png"
import furniture1 from "../images/categoryImg/furniture1.png"
import game1 from "../images/categoryImg/game1.png"
import glass1 from "../images/categoryImg/glass1.png"
import interior1 from "../images/categoryImg/interior1.png"
import jewellery1 from "../images/categoryImg/jewellery1.png"
import sport1 from "../images/categoryImg/sport1.png"
import toys1 from "../images/categoryImg/toys1.png"
import watch1 from "../images/categoryImg/watch1.png"
import book1 from "../images/categoryImg/book1.png"
import commercial1 from "../images/categoryImg/commercial1.png"
import AOS from 'aos';
import 'aos/dist/aos.css';
import ContactUsHome from './ContactUsHome'

const Home = () => {

  useEffect(() => {
    AOS.init();
  }, [])
 
  return (
    <HomeLayout>
      {/* ======= Hero Section ======= */}
<div id="hero" className="hero d-flex align-items-center section-bg">
  <div className="container">
    <div className="row justify-content-between gy-5">
      <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start">
        <h2 data-aos="fade-up" className="opemAuction">Open Ascending <br />Auction</h2>
        <p data-aos="fade-up" data-aos-delay={100} style={{fontFamily: 'Rajdhani'}}>The most seen type of auction, it’s also known as English auction. The buyers will start bidding with a low price, then the bid prices go up until there’s no more price bidding a higher price. The last person to bid, which is also the person who bids the highest price, will get the item</p>
        <div className="d-flex" data-aos="fade-up" data-aos-delay={200}>
        <Link to="/auction-now" className='p-2'>
            <button className='btn-add-item'>AUCTION NOW</button>
            </Link>
          <AddItem/>
        </div>
      </div>
      <div className="col-lg-5 order-1 order-lg-2 text-center text-lg-start pt-4">
        <img src={hp1} className="img-fluid hero-img" alt data-aos="zoom-out" data-aos-delay={300} />
      </div>
    </div>
  </div>
</div>{/* End Hero Section */}
<div className='homeCategory' id="category" data-aos="fade-up" data-aos-delay={300}>
<div className="container">
  <div className="category-header">
    <hr className="hr3" />
    <h3 style={{fontFamily:'Noto Sans TC'}}>FEATURED CATEGORY</h3>
  </div>
  <div className="row mt-2 g-4">
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right" >
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>Militaria & Historical documents</span> </div>
          <div> <img src={m1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>Old Arts & Painting</span> </div>
          <div> <img src={a1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>furniture</span> </div>
          <div> <img src={furniture1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>Books & Comics</span> </div>
          <div> <img src={book1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>Glass & Kitchenware</span> </div>
          <div> <img src={glass1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>Classic cars and Motorcycles</span> </div>
          <div> <img src={car1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename"> <span>Coins & Stamps</span> </div>
          <div> <img src={coins1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Entertainment & Games</div>
          <div> <img src={game1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Fashion</div>
          <div> <img src={fashion1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Interiors & Decorations </div>
          <div> <img src={interior1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Jewellery & Precious Stones</div>
          <div> <img src={jewellery1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Music & Cameras</div>
          <div> <img src={camera1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">sports</div>
          <div> <img src={sport1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-right">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Toys & Models </div>
          <div> <img src={toys1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">watches</div>
          <div> <img src={watch1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
    <div className="col-md-3">
      <div className="card card-category p-2" data-aos="fade-left">
        <div className="d-flex justify-content-between align-items-center p-2">
          <div className="flex-column lh-1 imagename">Commercial and Residential property</div>
          <div> <img src={commercial1} height={100} width={100} /> </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>


<div id="ContactUsHome" >
  
<ContactUsHome />
</div>



    </HomeLayout>
  )
}

export default Home