import React from 'react'
import Friends from '../components/Friends'
import MessageGroup from '../components/MessageGroups'
import Search from '../components/Search'
import Sidebar from '../components/Sidebar'

const Message = () => {
    return (
        <div className='flex justify-between h-screen w-full'>
            <div className='w-[186px] pl-8'>
                <Sidebar active="message" />
            </div>
            <div className='w-[427px]'>
                <Search />
                <div className='mt-2.5 mb-5'>
                    <MessageGroup />
                </div>
                <Friends />
            </div>
            <div className='w-[344px]'>
                bbbb
            </div>
            <div className='w-[344px]'>
                ccccc
            </div>
        </div>
    )
}

export default Message