import React from "react";
import { AiOutlineHome, AiFillMessage, AiOutlineBell } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { ImExit } from "react-icons/im";
import { IoMdCloudUpload } from "react-icons/io";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState } from "react";

import { ColorRing } from "react-loader-spinner";

const Sidebar = ({ active }) => {
  const auth = getAuth();
  const storage = getStorage();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // let data = useSelector(state => state.userLoginInfo.userInfo.photoURL);
  let data = auth.currentUser;

  const handleProfileUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoading(true);
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setImageUploadModal(false);
            setImage("");
            setCropData("#");
            setCropper("");
            setLoading(false);
          });
        });
      });
    }
  };

  let handleLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("userInfo");
        dispatch(userLoginInfo);
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  let handleImageUpload = () => {
    setImageUploadModal(true);
  };
  let handleCancel = () => {
    setImageUploadModal(false);
    setImage("");
    setCropData("#");
    setCropper("");
  };
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center gap-10 rounded-[20px] bg-button p-6">
        <div className="group relative">
          <div
            onClick={handleImageUpload}
            className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[rgba(0,0,0,.41)] opacity-0 group-hover:opacity-100"
          >
            <IoMdCloudUpload className="text-2xl text-white" />
          </div>
          {data.photoURL ? (
            <picture className="h-[100px] w-[100px] rounded-full">
              <img src={data.photoURL} alt="" className="rounded-full" />
            </picture>
          ) : (
            <picture className="h-[100px] w-[100px] rounded-full">
              <img
                src="images/demo-profile.png"
                alt=""
                className="rounded-full"
              />
            </picture>
          )}
        </div>
        <h2 className="nunito text-xl font-semibold text-white">
          {data.displayName}
        </h2>
        <div
          className={
            active == "home"
              ? 'relative z-[1] bg-white before:absolute before:top-[-16px] before:right-[-53px] before:h-[185%] before:w-2 before:rounded-tl-3xl before:rounded-bl-3xl before:bg-button before:content-[""] after:absolute after:top-[-16px] after:left-[-30px] after:z-[-1] after:h-[89px] after:w-[133px] after:bg-white after:content-[""]'
              : ""
          }
        >
          <Link to="/">
            <AiOutlineHome
              className={
                active == "home"
                  ? "z-10 cursor-pointer text-5xl text-button"
                  : "block cursor-pointer text-5xl text-[#BAD1FF]"
              }
            />
          </Link>
        </div>
        <div
          className={
            active == "message"
              ? 'relative z-[1] bg-white before:absolute before:top-[-16px] before:right-[-53px] before:h-[185%] before:w-2 before:rounded-tl-3xl before:rounded-bl-3xl before:bg-button before:content-[""] after:absolute after:top-[-16px] after:left-[-30px] after:z-[-1] after:h-[89px] after:w-[133px] after:bg-white after:content-[""]'
              : ""
          }
        >
          <Link to="/message">
            <AiFillMessage
              className={
                active == "message"
                  ? "z-10 cursor-pointer text-5xl text-button"
                  : "block cursor-pointer text-5xl text-[#BAD1FF]"
              }
            />
          </Link>
        </div>
        <div>
          <FiSettings className="block cursor-pointer text-5xl text-[#BAD1FF]" />
        </div>
        <div>
          <AiOutlineBell className="block cursor-pointer text-5xl text-[#BAD1FF]" />
        </div>
        <div onClick={handleLogOut}>
          <ImExit className="block cursor-pointer text-5xl text-[#BAD1FF]" />
        </div>
      </div>
      {imageUploadModal && (
        <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-button">
          <div className=" bg-white p-5">
            <h2 className="nunito text-xl font-semibold text-primary">
              Upload your profile
            </h2>

            {image ? (
              <div className="box mx-auto block h-28 w-28 overflow-hidden rounded-full">
                <div className="img-preview h-full w-full rounded-full" />
              </div>
            ) : (
              <picture className="mx-auto block h-28 w-28 ">
                <img src={data.photoURL} alt="" className="rounded-full" />
              </picture>
            )}
            <input
              type="file"
              className="my-5"
              onChange={handleProfileUpload}
            />
            {image && (
              <Cropper
                style={{ height: 200, width: "50%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                cropBoxResizable={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            )}
            <div className="">
              {loading ? (
                <ColorRing
                  visible={true}
                  height="50"
                  width="50"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              ) : (
                <button
                  onClick={getCropData}
                  className="nunito mt-5 mr-5 w-[200px] rounded-lg bg-button py-5 text-xl font-semibold text-white"
                >
                  Update
                </button>
              )}

              <button
                onClick={handleCancel}
                className="nunito mt-5 w-[200px] rounded-lg bg-red-400 py-5 text-xl font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
