import React, { useEffect } from 'react'
import Chat from '../components/Chat'
import Friends from '../components/Friends'
import MessageGroup from '../components/MessageGroups'
import Search from '../components/Search'
import Sidebar from '../components/Sidebar'
import { useSelector } from 'react-redux'

const Message = () => {
    let data = useSelector((state) => state.userLoginInfo.userInfo);

    return (
        <div className='flex justify-between h-screen w-full'>
            <div className='w-[186px] pl-8'>
                <Sidebar active="message" />
            </div>
            <div className='w-[427px] mt-7'>
                <Search />
                <div className='mt-2.5 mb-5'>
                    <MessageGroup />
                </div>
                <Friends />
            </div>
            <div className='w-[700px] mt-7'>
                <Chat />
            </div>
        </div>
    )
}

export default Message