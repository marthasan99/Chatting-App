import React, { useEffect, useState, useRef } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import {
  BsThreeDotsVertical,
  BsFillTriangleFill,
  BsCamera,
  BsEmojiLaughing,
  BsRecord,
} from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { FcGallery } from "react-icons/fc";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import ModalImage from "react-modal-image";
import { ImCross } from "react-icons/im";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import moment from "moment/moment";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ColorRing } from "react-loader-spinner";

const Chat = () => {
  const db = getDatabase();
  const storage = getStorage();
  let [cameraOpen, setCameraOpen] = useState(false);
  let [captureImage, setCaptureImage] = useState("");
  let [record, setRecord] = useState(false);
  let [messageInput, setMessageInput] = useState("");
  let [messageInputErr, setMessageInputErr] = useState("");
  let [messageList, setMessageList] = useState([]);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  let activeChatName = useSelector((state) => state.activeChat);
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");
    setCaptureImage(dataUri);

    const storageRef = sref(storage, "aaaa");
    uploadString(storageRef, dataUri, "data_url")
      .then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(push(ref(db, "singleMessage")), {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReceiveId: activeChatName.active.id,
            whoReceiveName: activeChatName.active.name,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}   ${new Date().getHours()} ${new Date().getMinutes()}`,
            image: downloadURL,
          });
        });
      })
      .then(() => {
        setCameraOpen(!cameraOpen);
      });
  }

  function handleTakePhotoAnimationDone(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");
  }

  function handleCameraError(error) {
    console.log("handleCameraError", error);
  }

  function handleCameraStart(stream) {
    console.log("handleCameraStart");
  }

  function handleCameraStop() {
    console.log("handleCameraStop");
  }
  let handleMessageInput = (e) => {
    setMessageInput(e.target.value);
    if (messageInput != "") {
      setMessageInputErr("");
    }
  };
  let handleMessageSend = () => {
    if (messageInput === "") {
      setMessageInputErr("Message is empty");
    }
    if (activeChatName.active.status == "single") {
      if (messageInput != "") {
        set(push(ref(db, "singleMessage")), {
          whoSendId: data.uid,
          whoSendName: data.displayName,
          whoReceiveId: activeChatName.active.id,
          whoReceiveName: activeChatName.active.name,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}   ${new Date().getHours()} ${new Date().getMinutes()}`,
          message: messageInput,
        });
      }
    } else {
    }
  };
  useEffect(() => {
    const singleMessage = ref(db, "singleMessage/");
    onValue(singleMessage, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whoSendId == data.uid &&
            item.val().whoReceiveId == activeChatName.active.id) ||
          (item.val().whoSendId == activeChatName.active.id &&
            item.val().whoReceiveId == data.uid)
        ) {
          arr.push(item.val());
        }
      });
      setMessageList(arr);
    });
  }, [activeChatName.active.id]);
  let handleImageUpload = (e) => {
    setImageUploadModal(!imageUploadModal);
  };
  // let handleImageUpload = (e) => {
  //   console.log(e.target.files[0]);
  //   const storageRef = sref(storage, e.target.files[0].name);

  //   const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + "% done");
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("File available at", downloadURL);
  //         set(push(ref(db, "singleMessage")), {
  //           whoSendId: data.uid,
  //           whoSendName: data.displayName,
  //           whoReceiveId: activeChatName.active.id,
  //           whoReceiveName: activeChatName.active.name,
  //           date: `${new Date().getFullYear()}-${
  //             new Date().getMonth() + 1
  //           }-${new Date().getDate()}   ${new Date().getHours()} ${new Date().getMinutes()}`,
  //           image: downloadURL,
  //         });
  //       });
  //     }
  //   );
  // };

  let handleUpload = (e) => {
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

      const storageRef = sref(storage, "aaaa" + Math.random());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(push(ref(db, "singleMessage")), {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReceiveId: activeChatName.active.id,
            whoReceiveName: activeChatName.active.name,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}   ${new Date().getHours()} ${new Date().getMinutes()}`,
            image: downloadURL,
          }).then(() => {
            setLoading(false);
            setImageUploadModal(false);
            setImage("");
            setCropData("#");
            setCropper("");
          });
        });
      });
    }
  };
  let handleCancel = () => {
    setImageUploadModal(false);
    setImage("");
    setCropData("#");
    setCropper("");
  };
  return (
    <>
      <div className="mr-9 rounded-[20px]  pr-12 pl-10 shadow-search">
        <div className="flex items-center gap-x-8 border-b-2 border-solid border-[rgba(0,0,0,.25)] pt-6 pb-6">
          <div className="relative">
            <picture>
              <img
                src="images/profile.png"
                className="rounded-full drop-shadow-group"
                alt=""
              />
            </picture>
            <div className="absolute  bottom-1 right-2.5 h-4 w-4 rounded-full border-2 border-solid border-white bg-[#00FF75] shadow-chat"></div>
          </div>
          <div>
            <h3 className="font-poppins text-2xl font-semibold">
              {activeChatName.active.name}
            </h3>
            <p className="font-regular font-poppins text-sm text-[rgba(0,0,0,.85%)]">
              Online
            </p>
          </div>
          <div className="ml-auto ">
            <BsThreeDotsVertical className="float-right text-button" />
          </div>
        </div>
        <div className="border-b border-solid border-[rgba(0,0,0,.25)]">
          <div className=" h-[340px] overflow-y-scroll">
            {activeChatName.active.status == "single" ? (
              messageList.map((item) =>
                item.whoSendId == data.uid ? (
                  item.message ? (
                    <div className="mr-6 py-2 text-right">
                      <p className="relative mr-2.5 inline-block bg-button px-12 py-[13px] text-left font-poppins text-base font-medium text-white">
                        {item.message}
                        <BsFillTriangleFill className="absolute right-[-10px] bottom-[-1px] text-xl text-button" />
                      </p>
                      <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </div>
                  ) : (
                    <div className="mr-6 py-2 text-right">
                      <p className="relative mr-2.5 inline-block bg-button px-6 py-[13px] text-left font-poppins text-base font-medium text-white">
                        <ModalImage
                          className="h-[350px] w-[250px]"
                          small={item.image}
                          large={item.image}
                          alt="Image"
                        />
                        <BsFillTriangleFill className="absolute right-[-10px] bottom-[-1px] text-xl text-button" />
                      </p>
                      <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </div>
                  )
                ) : item.message ? (
                  <div className="py-2">
                    <p className="relative ml-2.5 inline-block bg-[#F1F1F1] px-12 py-[13px] font-poppins text-base font-medium">
                      {item.message}
                      <BsFillTriangleFill className="absolute left-[-10px] bottom-[-1px] text-xl text-[#F1F1F1]" />
                    </p>
                    <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="relative ml-2.5 inline-block bg-[#F1F1F1] px-6 py-[13px] font-poppins text-base font-medium">
                      <ModalImage
                        className="h-[350px] w-[250px]"
                        small={item.image}
                        large={item.image}
                        alt="Image"
                      />
                      <BsFillTriangleFill className="absolute left-[-10px] bottom-[-1px] text-xl text-[#F1F1F1]" />
                    </p>
                    <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                )
              )
            ) : (
              <h1>Group Message</h1>
            )}
            {/* received message */}
            {/* <div className="py-2">
              <p className="relative ml-2.5 inline-block bg-[#F1F1F1] px-12 py-[13px] font-poppins text-base font-medium">
                Hi There!!
                <BsFillTriangleFill className="absolute left-[-10px] bottom-[-1px] text-xl text-[#F1F1F1]" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* sent message */}
            {/* <div className="mr-6 text-right py-2">
              <p className="relative mr-2.5 inline-block bg-button px-12 py-[13px] text-left font-poppins text-base font-medium text-white">
                Hi There!!
                <BsFillTriangleFill className="absolute right-[-10px] bottom-[-1px] text-xl text-button" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* received image */}
            {/* <div className="py-2">
              <p className="relative ml-2.5 inline-block bg-[#F1F1F1] px-6 py-[13px] font-poppins text-base font-medium">
                <ModalImage
                  className="h-[350px] w-[250px]"
                  small={"images/registration.png"}
                  large={"images/registration.png"}
                  alt="Image"
                />
                <BsFillTriangleFill className="absolute left-[-10px] bottom-[-1px] text-xl text-[#F1F1F1]" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* sent image */}
            {/* <div className="mr-6 text-right py-2">
              <p className="relative mr-2.5 inline-block bg-button px-6 py-[13px] text-left font-poppins text-base font-medium text-white">
                <ModalImage
                  className="h-[350px] w-[250px]"
                  small={"images/registration.png"}
                  large={"images/registration.png"}
                  alt="Image"
                />
                <BsFillTriangleFill className="absolute right-[-10px] bottom-[-1px] text-xl text-button" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* received audio */}
            {/* <div className="py-2">
              <p className="relative ml-2.5 inline-block bg-[#F1F1F1] px-6 py-[13px] font-poppins text-base font-medium">
                <audio controls></audio>
                <BsFillTriangleFill className="absolute left-[-10px] bottom-[-1px] text-xl text-[#F1F1F1]" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* sent audio */}
            {/* <div className="mr-6 text-right py-2">
              <p className="relative mr-2.5 inline-block bg-button px-6 py-[13px] text-left font-poppins text-base font-medium text-white">
                <audio controls></audio>
                <BsFillTriangleFill className="absolute right-[-10px] bottom-[-1px] text-xl text-button" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* received video */}
            {/* <div className="py-2">
              <p className="relative ml-2.5 inline-block bg-[#F1F1F1] px-6 py-[13px] font-poppins text-base font-medium">
                <video controls></video>
                <BsFillTriangleFill className="absolute left-[-10px] bottom-[-1px] text-xl text-[#F1F1F1]" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
            {/* sent video */}
            {/* <div className="mr-6 text-right py-2">
              <p className="relative mr-2.5 inline-block bg-button px-6 py-[13px] text-left font-poppins text-base font-medium text-white">
                <video controls></video>
                <BsFillTriangleFill className="absolute right-[-10px] bottom-[-1px] text-xl text-button" />
              </p>
              <p className="font-poppins text-xs font-medium text-[rgba(0,0,0,.25)]">
                Today, 2:01pm
              </p>
            </div> */}
          </div>
        </div>
        <p className="text-dm mb-[-30px] text-sm font-bold text-red-500">
          {messageInputErr}
        </p>
        <div className="relative mt-[30px] flex py-9">
          <div className="">
            <input
              onChange={handleMessageInput}
              className=" w-[500px] rounded-xl border-transparent bg-[#f1f1f1] p-4 pr-12 focus:border-transparent focus:ring-0"
            />

            <BsCamera
              onClick={() => setCameraOpen(!cameraOpen)}
              className="absolute right-[86px] top-[43%] text-xl text-[rgba(0,0,0,.5)]"
            />
            <BsEmojiLaughing className="absolute right-[114px] top-[43%] text-xl text-[rgba(0,0,0,.5)]" />

            <FcGallery
              onClick={handleImageUpload}
              className="absolute right-[142px] top-[43%] text-xl text-[rgba(0,0,0,.5)]"
            />
            {record ? (
              <BsFillMicFill
                onClick={() => {
                  setRecord(!record);
                }}
                className="absolute right-[170px] top-[43%] text-xl text-[rgba(0,0,0,.5)]"
              />
            ) : (
              <BsFillMicMuteFill
                onClick={() => {
                  setRecord(!record);
                }}
                className="absolute right-[170px] top-[43%] text-xl text-[rgba(0,0,0,.5)]"
              />
            )}
          </div>
          <div className="ml-5 bg-button p-4">
            <FaTelegramPlane
              onClick={handleMessageSend}
              className="text-2xl text-white"
            />
          </div>
        </div>
      </div>
      {cameraOpen && (
        <div className="fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,.8)]">
          <ImCross
            onClick={() => setCameraOpen(!cameraOpen)}
            className="absolute top-10 right-10 z-50 text-2xl text-white"
          />
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            onTakePhotoAnimationDone={(dataUri) => {
              handleTakePhotoAnimationDone(dataUri);
            }}
            onCameraError={(error) => {
              handleCameraError(error);
            }}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution={{ width: 600, height: 450 }}
            imageType={IMAGE_TYPES.JPG}
            imageCompression={0.97}
            isMaxResolution={true}
            isImageMirror={true}
            isSilentMode={false}
            isDisplayStartCameraError={true}
            isFullscreen={true}
            sizeFactor={1}
            onCameraStart={(stream) => {
              handleCameraStart(stream);
            }}
            onCameraStop={() => {
              handleCameraStop();
            }}
          />
        </div>
      )}
      {imageUploadModal && (
        <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-button">
          <div className=" bg-white p-5">
            <h2 className="nunito text-xl font-semibold text-primary">
              Upload Image
            </h2>
            {image ? (
              <div className="box mx-auto block h-28 w-28 overflow-hidden rounded-full">
                <div className="img-preview h-full w-full rounded-full" />
              </div>
            ) : (
              <picture className="mx-auto block h-28 w-28 ">
                <img src="images/profile.png" alt="" className="rounded-full" />
              </picture>
            )}
            <input type="file" className="my-5" onChange={handleUpload} />
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
            )}{" "}
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

export default Chat;
