import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { userLoginInfo } from '../slices/userSlice';
import BlockedUser from '../components/BlockedUser';
import FriendRequest from '../components/FriendRequest';
import Friends from '../components/Friends';
import GroupList from '../components/GroupList';
import MyGroups from '../components/MyGroups';
import Search from '../components/Search';
import Sidebar from '../components/Sidebar';
import UserList from '../components/UserList';


const Home = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const dispatch = useDispatch()
    let data = useSelector((state) => state.userLoginInfo.userInfo);
    let [verified, setVerified] = useState(false);

    onAuthStateChanged(auth, (user) => {
        if (user.emailVerified) {
            setVerified(true);
            dispatch(userLoginInfo(user));
            localStorage.setItem("userInfo", JSON.stringify(user));
        }
    })
    useEffect(() => {
        if (!data) {
            navigate("/login");
        }
    }, [])

    return (
        <>
            {verified ? <div className='flex justify-between h-screen w-full'>
                <div className='w-[186px] pl-8'>
                    <Sidebar />
                </div>
                <div className='w-[427px]'>
                    <Search />
                    <GroupList />
                    <FriendRequest />
                </div>
                <div className='w-[344px]'>
                    <Friends />
                    <MyGroups />
                </div>
                <div className='w-[344px]'>
                    <UserList />
                    <BlockedUser />
                </div>
            </div> : <div className='w-full h-screen bg-button flex justify-center items-center'>
                <h1 className='text-white font-bold text-5xl'>Please Verify your email</h1>
            </div>}
        </>
    )
}

export default Home