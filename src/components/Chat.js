import React, { useState } from 'react'
import { BsThreeDotsVertical, BsFillTriangleFill, BsCamera, BsEmojiLaughing, BsRecord } from 'react-icons/bs'
import { FaTelegramPlane } from 'react-icons/fa'
import { FcGallery } from 'react-icons/fc'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ModalImage from "react-modal-image";
import { ImCross } from 'react-icons/im'
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs'



const Chat = () => {
    let [cameraOpen, setCameraOpen] = useState(false);
    let [captureImage, setCaptureImage] = useState('');
    let [record, setRecord] = useState(false)

    function handleTakePhoto(dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
        setCaptureImage(dataUri);
    }

    function handleTakePhotoAnimationDone(dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
    }

    function handleCameraError(error) {
        console.log('handleCameraError', error);
    }

    function handleCameraStart(stream) {
        console.log('handleCameraStart');
    }

    function handleCameraStop() {
        console.log('handleCameraStop');
    }
    return (
        <>
            <div className='shadow-search rounded-[20px]  pr-12 pl-10 mr-9'>
                <div className='flex items-center gap-x-8 pt-6 pb-6 border-b-2 border-solid border-[rgba(0,0,0,.25)]'>
                    <div className='relative'>
                        <picture >
                            <img src='images/profile.png' className='drop-shadow-group rounded-full' />
                        </picture>
                        <div className='absolute  bottom-1 right-2.5 h-4 w-4 rounded-full bg-[#00FF75] border-2 border-solid border-white shadow-chat'></div>
                    </div>
                    <div>
                        <h3 className='font-poppins font-semibold text-2xl'>Mahadi Hasan</h3>
                        <p className='font-poppins font-regular text-sm text-[rgba(0,0,0,.85%)]'>Online</p>

                    </div>
                    <div className='ml-auto '>
                        <BsThreeDotsVertical className='float-right text-button' />
                    </div>
                </div>
                <div className='border-b border-solid border-[rgba(0,0,0,.25)]'>
                    <div className=' overflow-y-scroll h-[340px]'>
                        {/* received message */}
                        <div className='py-7'>
                            <p className='relative inline-block font-poppins font-medium text-base ml-2.5 px-12 py-[13px] bg-[#F1F1F1]'>Hi There!!
                                <BsFillTriangleFill className='absolute left-[-10px] bottom-[-1px] text-[#F1F1F1] text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* sent message */}
                        <div className='text-right mr-6'>
                            <p className='relative inline-block font-poppins font-medium text-base mr-2.5 px-12 py-[13px] bg-button text-white text-left'>Hi There!!
                                <BsFillTriangleFill className='absolute right-[-10px] bottom-[-1px] text-button text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* received image */}
                        <div className='py-7'>
                            <p className='relative inline-block font-poppins font-medium text-base ml-2.5 px-6 py-[13px] bg-[#F1F1F1]'>
                                <ModalImage
                                    className='h-[350px] w-[250px]'
                                    small={'images/registration.png'}
                                    large={'images/registration.png'}
                                    alt="Image"
                                />
                                <BsFillTriangleFill className='absolute left-[-10px] bottom-[-1px] text-[#F1F1F1] text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* sent image */}
                        <div className='text-right mr-6'>
                            <p className='relative inline-block font-poppins font-medium text-base mr-2.5 px-6 py-[13px] bg-button text-white text-left'>
                                <ModalImage
                                    className='h-[350px] w-[250px]'
                                    small={'images/registration.png'}
                                    large={'images/registration.png'}
                                    alt="Image"
                                />
                                <BsFillTriangleFill className='absolute right-[-10px] bottom-[-1px] text-button text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* received audio */}
                        <div className='py-7'>
                            <p className='relative inline-block font-poppins font-medium text-base ml-2.5 px-6 py-[13px] bg-[#F1F1F1]'>
                                <audio controls></audio>
                                <BsFillTriangleFill className='absolute left-[-10px] bottom-[-1px] text-[#F1F1F1] text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* sent audio */}
                        <div className='text-right mr-6'>
                            <p className='relative inline-block font-poppins font-medium text-base mr-2.5 px-6 py-[13px] bg-button text-white text-left'>
                                <audio controls></audio>
                                <BsFillTriangleFill className='absolute right-[-10px] bottom-[-1px] text-button text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* received video */}
                        <div className='py-7'>
                            <p className='relative inline-block font-poppins font-medium text-base ml-2.5 px-6 py-[13px] bg-[#F1F1F1]'>
                                <video controls></video>
                                <BsFillTriangleFill className='absolute left-[-10px] bottom-[-1px] text-[#F1F1F1] text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                        {/* sent video */}
                        <div className='text-right mr-6'>
                            <p className='relative inline-block font-poppins font-medium text-base mr-2.5 px-6 py-[13px] bg-button text-white text-left'>
                                <video controls></video>
                                <BsFillTriangleFill className='absolute right-[-10px] bottom-[-1px] text-button text-xl' />
                            </p>
                            <p className='text-[rgba(0,0,0,.25)] font-poppins font-medium text-xs'>Today, 2:01pm</p>
                        </div>
                    </div>
                </div>
                <div className='flex py-9 relative'>

                    <div className=''>
                        <input className=' p-4 bg-[#f1f1f1] pr-12 w-[500px] rounded-xl border-transparent focus:border-transparent focus:ring-0' />
                        <BsCamera onClick={() => (setCameraOpen(!cameraOpen))} className='absolute right-[86px] top-[43%] text-xl text-[rgba(0,0,0,.5)]' />
                        <BsEmojiLaughing className='absolute right-[114px] top-[43%] text-xl text-[rgba(0,0,0,.5)]' />
                        <label>
                            <input type='file' className='hidden' />
                            <FcGallery className='absolute right-[142px] top-[43%] text-xl text-[rgba(0,0,0,.5)]' />
                        </label>
                        {record
                            ?
                            <BsFillMicFill onClick={() => { setRecord(!record) }} className='absolute right-[170px] top-[43%] text-xl text-[rgba(0,0,0,.5)]' />
                            :
                            <BsFillMicMuteFill onClick={() => { setRecord(!record) }} className='absolute right-[170px] top-[43%] text-xl text-[rgba(0,0,0,.5)]' />
                        }

                    </div>
                    <div className='p-4 ml-5 bg-button'>
                        <FaTelegramPlane className='text-white text-2xl' />
                    </div>
                </div>


            </div >
            {cameraOpen &&
                <div className='w-full h-full z-40 fixed top-0 left-0 bg-[rgba(0,0,0,.8)] flex justify-center items-center'>
                    <ImCross onClick={() => (setCameraOpen(!cameraOpen))} className='absolute top-10 right-10 text-2xl text-white z-50' />
                    <Camera
                        onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                        onTakePhotoAnimationDone={(dataUri) => { handleTakePhotoAnimationDone(dataUri); }}
                        onCameraError={(error) => { handleCameraError(error); }}
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
                        onCameraStart={(stream) => { handleCameraStart(stream); }}
                        onCameraStop={() => { handleCameraStop(); }}
                    />
                </div>
            }

        </>

    )
}

export default Chat