import React, { useState, useEffect } from "react";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Spinner from "../components/Spinner";
//import "../styles/ReviewItemStyle.css"
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from 'react-toastify';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper";

const ReviewItem = () => {
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [changeDetails, setChangeDetails] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "items", params.itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setItem(docSnap.data());
        setLoading(false);
      }
    };
    fetchItem();
  }, [params.itemId]);

  const [formData, setFormData] = useState({
    itemName: "",
    itemDec: "",
    startPrice: 0,
    ItemDuration: 0,
    images: {},
  });

  const onChangeHandler = (e) => {
    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //text
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }


  const onDelete=()=>{
    const docRef = doc(db, "items", params.itemId);
    deleteDoc(docRef)
    .then(() => {
        toast.success("Item has been deleted successfully.")
        navigate("/");
    })
    .catch(error => {
      toast.error("There is some issue")
        console.log(error);
    })
  }

  return (
    <Layout>
      <div className="container">
        <section className="mx-auto my-5" style={{ maxWidth: "40rem" }}>
          <div className="card">
            <div className="p-3 fw-bold fs-5">
              <span>Please review or update your item...</span>
            </div>
            <div
              className="bg-image hover-overlay ripple"
              data-mdb-ripple-color="light"
            >
              {item.imgUrls === undefined ? (
                <Spinner />
              ) : (
                <img src={item.imgUrls[0]} className="card-img-top"/>
                // <div
                //   id="carouselExampleInterval"
                //   className="carousel slide"
                //   data-bs-ride="carousel"
                // >
                //   <div className="carousel-inner">
                //     {item.imgUrls.map((url, index) => (
                //       <div
                //         className="carousel-item active"
                //         data-bs-interval="10000"
                //         key={index}
                //       >
                //         <img
                //           src={item.imgUrls[index]}
                //           alt={item.name}
                //           className="img-fluid"
                //         />
                //       </div>
                //     ))}
                //   </div>
                //   <button
                //     className="carousel-control-prev"
                //     type="button"
                //     data-bs-target="#carouselExampleInterval"
                //     data-bs-slide="prev"
                //   >
                //     <span
                //       className="carousel-control-prev-icon"
                //       aria-hidden="true"
                //     ></span>
                //     <span className="visually-hidden">Previous</span>
                //   </button>
                //   <button
                //     className="carousel-control-next"
                //     type="button"
                //     data-bs-target="#carouselExampleInterval"
                //     data-bs-slide="next"
                //   >
                //     <span
                //       className="carousel-control-next-icon"
                //       aria-hidden="true"
                //     ></span>
                //     <span className="visually-hidden">Next</span>
                //   </button>
                // </div>
              )}
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
                    value={item.itemName}
                    onChange={onChangeHandler}
                    disabled={!changeDetails}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={item.itemCategory}
                    onChange={onChangeHandler}
                    disabled={!changeDetails}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    start price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={item.startPrice}
                    onChange={onChangeHandler}
                    disabled={!changeDetails}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={item.ItemDuration}
                    onChange={onChangeHandler}
                    disabled={!changeDetails}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={item.itemDec}
                    onChange={onChangeHandler}
                    disabled={!changeDetails}
                  />
                </div>
              </form>
              <hr className="my-4" />

              <div className="d-flex justify-content-around">
                <a href="/" className="btn btn-success">
                  Done
                </a>
                {/* <a
                  href="#!"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setChangeDetails((prevState) => !prevState);
                  }}
                >
                  Update
                </a> */}
                <a className="btn btn-danger" onClick={onDelete}>
                  Delete
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ReviewItem;
