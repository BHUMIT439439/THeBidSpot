import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate,useParams  } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { db } from "../firebase.config";
import {
    addDoc, // eslint-disable-line
    collection, // eslint-disable-line
    serverTimestamp,
    doc,
    updateDoc,
    getDoc,
  } from "firebase/firestore";
  
import { Modal } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import "bootstrap/dist/css/bootstrap.min.css";
import useAuthState from "../../src/hooks/useAuthState";
import { Link } from "react-router-dom";
import "../styles/AddItemStyle.css"


const EditItem = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setLisitng] = useState(null);
  const [loading, setLoading] = useState(false);

  let currentEmail = null;
  let { loggedIn } = useAuthState();
  if (loggedIn) {
    currentEmail = auth.currentUser.email;
  }

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(true);
  const openForm = () => setShowForm(true);
  
  const closeForm = () => {
    setShowForm(false);
    navigate("/profile")
  }

  const [formData, setFormData] = useState({
    itemName: "",
    itemDec: "",
    startPrice: 0,
    ItemDuration: 0,
    images: {},
  });

  const { itemName, itemDec, startPrice, ItemDuration, images } = formData;

  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        setFormData({
          ...formData,
          useRef: user.uid,
        });
      });
    } else {
      navigate("/signin");
    }

    // eslint-disable-next-line
  }, []);



  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "items", params.itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLisitng(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Lisitng NOt Exists");
      }
    };
    fetchListing();
  }, [navigate, params.itemId]);

  if (loading) {
    return <Spinner />;
  }

  //mutate func
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

  //form submit
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);

    //store images to firebase storage
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("uplloas is" + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("upload is paused");
                break;
              case "running":
                console.log("upload is runnning");
            }
          },
          (error) => {
            reject(error);
          },
          //success
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    //getting value of choosen category
    const itemCategory = document.getElementById("ddlViewBy").value;
    const email = currentEmail;

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    console.log(imgUrls);

    //save form data
    const formDataCopy = {
      ...formData,
      itemCategory,
      imgUrls,
      email,
      timestamp: serverTimestamp(),
    };
    console.log(formDataCopy);
    delete formDataCopy.images;
    const docRef = doc(db, "items", params.itemId);
    await updateDoc(docRef, formDataCopy);
    toast.success("Listing updated!!");
    setLoading(false);
    console.log("-----------------" + docRef.id + "-----------------------");
    navigate("/profile");
  };

  return (
    <>
      {/* <Link className='p-2'>
            <button className='btn-add-item' onClick={openForm}>+ Add Item</button>
            </Link> */}

      <Modal centered show={showForm} onHide={closeForm}>
        {loggedIn ? (
          <>
            <Modal.Header>
              <Modal.Title className="font-monospace">
                Update Your Item
              </Modal.Title>
              <CloseButton onClick={closeForm} />
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={onSubmit}>
                {/* item name */}
                <div className="mb-3 mt-4">
                  <label htmlFor="name" className="form-label">
                    Choose Category:
                  </label>
                  <select
                    name="languages"
                    id="ddlViewBy"
                    className="form-control"
                    defaultValue="Militaria & Historical documents"
                  >
                    <option value="Art">Art</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Glass & Kitchenware">
                      Glass & Kitchenware
                    </option>
                    <option value="Books & Comics">Books & Comics</option>
                    <option value="Classis cars, Motorcycles & Automobila">
                      Classis cars, Motorcycles & Automobila
                    </option>
                    <option value="Coins & Stamps">Coins & Stamps</option>
                    <option value="Entertainment & Games">
                      Entertainment & Games
                    </option>
                    <option value="Fashion">Fashion</option>
                    <option value="Interiors & Decorations">
                      Interiors & Decorations
                    </option>
                    <option value="Jewellery & Precious Stones">
                      Jewellery & Precious Stones
                    </option>
                    <option value="Militaria & Historical documents">
                      Militaria & Historical documents
                    </option>
                    <option value="Music & Cameras">Music & Cameras</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys & Models">Toys & Models</option>
                    <option value="Watches">Watches</option>
                  </select>
                </div>
                <div className="mb-3 mt-4">
                  <label htmlFor="name" className="form-label">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="itemName"
                    value={itemName}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                {/* item description */}
                <div className="mb-3 mt-4">
                  <label htmlFor="name" className="form-label">
                    Item Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="itemDec"
                    value={itemDec}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                {/* Starting Price */}
                <div className="mb-3 mt-4">
                  <label htmlFor="name" className="form-label">
                    Starting Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="startPrice"
                    value={startPrice}
                    onChange={onChangeHandler}
                    min="0"
                    required
                  />
                </div>

                {/* Item Duration */}
                <div className="mb-3 mt-4">
                  <label htmlFor="name" className="form-label">
                    Item Duration
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="ItemDuration"
                    value={ItemDuration}
                    onChange={onChangeHandler}
                    min="0"
                    required
                  />
                </div>
                {/* seller mail id */}
                <div className="mb-3 mt-4">
                  <label htmlFor="name" className="form-label">
                    Seller
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sellerId"
                    value={currentEmail}
                    required
                    readOnly
                  />
                </div>

                {/* files images etc */}
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                    select images :
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="images"
                    name="images"
                    onChange={onChangeHandler}
                    max="6"
                    accept=".jpg,.png,.jpeg"
                    multiple
                    required
                  />
                </div>
                {/* submit button */}
                <div className="mb-3">
                  <input
                    className="btn btn-primary w-100"
                    type="submit"
                    value="UPDATE"
                  />
                </div>
              </form>
            </Modal.Body>
          </>
        ) : (
          <>
            <Modal.Header>
              <Modal.Title className="font-monospace">
                Please sign in to add item
              </Modal.Title>
              <CloseButton onClick={closeForm} />
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
              <Link to="/signin">
                <div onClick={openForm} className="btn btn btn-primary w-50 ">
                  Sign In
                </div>
              </Link>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export default EditItem;
