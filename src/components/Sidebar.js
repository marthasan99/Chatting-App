import React from 'react'
import { AiOutlineHome, AiFillMessage, AiOutlineBell } from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'
import { ImExit } from 'react-icons/im'
import { IoMdCloudUpload } from 'react-icons/io'
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState } from 'react'

import { ColorRing } from 'react-loader-spinner'


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
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL,
                    }).then(
                        () => {
                            setImageUploadModal(false);
                            setImage("");
                            setCropData("#");
                            setCropper("");
                            setLoading(false);
                        }
                    )
                })
            });
        }

    };


    let handleLogOut = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('userInfo');
            dispatch(userLoginInfo);
            navigate('/login');
        }).catch((error) => {
            // An error happened.
        });
    }
    let handleImageUpload = () => {
        setImageUploadModal(true);
    }
    let handleCancel = () => {
        setImageUploadModal(false);
        setImage("");
        setCropData("#");
        setCropper("");
    }
    return (
        <>
            <div className='bg-button h-screen w-full rounded-[20px] flex flex-col items-center p-6 gap-10'>
                <div className='relative group'>
                    <div onClick={handleImageUpload} className='absolute opacity-0 group-hover:opacity-100 cursor-pointer top-0 left-0 bg-[rgba(0,0,0,.41)] w-full h-full rounded-full flex justify-center items-center'>
                        <IoMdCloudUpload className='text-white text-2xl' />
                    </div>
                    {
                        data.photoURL
                            ?
                            <picture className='w-[100px] h-[100px] rounded-full'>
                                <img src={data.photoURL} alt='' className='rounded-full' />
                            </picture>
                            :
                            <picture className='w-[100px] h-[100px] rounded-full'>
                                <img src='images/demo-profile.png' alt='' className='rounded-full' />
                            </picture>
                    }

                </div>
                <h2 className='nunito text-white text-xl font-semibold'>{data.displayName}</h2>
                <div className={active == 'home'
                    ?
                    'bg-white relative after:absolute after:bg-white after:content-[""] after:top-[-16px] after:left-[-30px] after:w-[133px] after:h-[89px] z-[1] after:z-[-1] before:bg-button before:absolute before:content-[""] before:top-[-16px] before:right-[-53px] before:h-[185%] before:w-2 before:rounded-tl-3xl before:rounded-bl-3xl'
                    : ''}>
                    <Link to='/'>
                        <AiOutlineHome className={active == 'home' ?
                            'text-5xl text-button z-10 cursor-pointer'
                            : 'text-[#BAD1FF] text-5xl block cursor-pointer'} />
                    </Link>
                </div>
                <div className={active == 'message'
                    ?
                    'bg-white relative after:absolute after:bg-white after:content-[""] after:top-[-16px] after:left-[-30px] after:w-[133px] after:h-[89px] z-[1] after:z-[-1] before:bg-button before:absolute before:content-[""] before:top-[-16px] before:right-[-53px] before:h-[185%] before:w-2 before:rounded-tl-3xl before:rounded-bl-3xl'
                    : ''}>
                    <Link to='/message'>
                        <AiFillMessage className={active == 'message' ?
                            'text-5xl text-button z-10 cursor-pointer'
                            : 'text-[#BAD1FF] text-5xl block cursor-pointer'} />
                    </Link>
                </div>
                <div>
                    <FiSettings className='text-[#BAD1FF] text-5xl block cursor-pointer' />
                </div>
                <div>
                    <AiOutlineBell className='text-[#BAD1FF] text-5xl block cursor-pointer' />
                </div>
                <div onClick={handleLogOut}>
                    <ImExit className='text-[#BAD1FF] text-5xl block cursor-pointer' />
                </div>
            </div>
            {
                imageUploadModal &&
                <div className='bg-button w-full h-full fixed top-0 left-0 z-10 flex justify-center items-center'>
                    <div className=' bg-white p-5'>
                        <h2 className='nunito text-primary text-xl font-semibold'>Upload your profile</h2>

                        {image ?
                            <div className="box w-28 h-28 block mx-auto overflow-hidden rounded-full">
                                <div
                                    className="img-preview w-full h-full rounded-full"
                                />
                            </div>
                            :
                            <picture className='w-28 h-28 block mx-auto '>
                                <img src={data.photoURL} alt='' className='rounded-full' />
                            </picture>
                        }
                        <input type="file" className='my-5' onChange={handleProfileUpload} />
                        {image &&
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
                        }
                        <div className=''>
                            {loading ?
                                <ColorRing
                                    visible={true}
                                    height="50"
                                    width="50"
                                    ariaLabel="blocks-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="blocks-wrapper"
                                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                />
                                :
                                <button onClick={getCropData} className='bg-button w-[200px] mt-5 mr-5 py-5 nunito text-white text-xl font-semibold rounded-lg'>Update</button>
                            }


                            <button onClick={handleCancel} className='bg-red-400 w-[200px] mt-5 py-5 nunito text-white text-xl font-semibold rounded-lg'>Cancel</button>
                        </div>

                    </div>
                </div>
            }

        </>
    )
}

export default Sidebar