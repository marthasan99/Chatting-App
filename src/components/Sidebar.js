import React from 'react'
import { AiOutlineHome, AiFillMessage, AiOutlineBell } from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'
import { ImExit } from 'react-icons/im'
import { IoMdCloudUpload } from 'react-icons/io'
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice'


const Sidebar = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    }
    return (
        <>
            <div className='bg-button h-screen w-full rounded-[20px] flex flex-col items-center p-6 gap-10'>
                <div className='relative group'>
                    <div onClick={handleImageUpload} className='absolute opacity-0 group-hover:opacity-100 cursor-pointer top-0 left-0 bg-[rgba(0,0,0,.41)] w-full h-full rounded-full flex justify-center items-center'>
                        <IoMdCloudUpload className='text-white text-2xl' />
                    </div>
                    <picture className='w-[100px] h-[100px] rounded-full'>
                        <img src='images/profile.png' alt='' className='' />
                    </picture>
                </div>
                <div className='bg-white relative after:absolute after:bg-white after:content-[""] after:top-[-16px] after:left-[-30px] after:w-[133px] after:h-[89px] z-[1] after:z-[-1] before:bg-button before:absolute before:content-[""] before:top-[-16px] before:right-[-53px] before:h-[185%] before:w-2 before:rounded-tl-3xl before:rounded-bl-3xl'>
                    <AiOutlineHome className='text-5xl text-button z-10 cursor-pointer' />
                </div>
                <div>
                    <AiFillMessage className='text-[#BAD1FF] text-5xl block cursor-pointer' />
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
            <div className='bg-button w-full h-full fixed top-0 left-0 z-10 flex justify-center items-center'>
                <div className=' bg-white p-5'>
                    <h2 className='nunito text-primary text-xl font-semibold'>Upload your profile</h2>
                    <input type="file" className='my-5' />
                    <div className=''>
                        <button className='bg-button w-[200px] mt-5 mr-5 py-5 nunito text-white text-xl font-semibold rounded-lg'>Update</button>
                        <button className='bg-red-400 w-[200px] mt-5 py-5 nunito text-white text-xl font-semibold rounded-lg'>Cancel</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Sidebar