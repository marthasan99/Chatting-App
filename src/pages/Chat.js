import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const Chat = () => {
    const db = getDatabase();
    let data = useSelector(state => state.userLoginInfo.userInfo);
    let [groupMemberList, setGroupMemberList] = useState([]);
    let [groupMemberList2, setGroupMemberList2] = useState([]);
    console.log(groupMemberList)
    console.log(groupMemberList2)

    useEffect(() => {
        const groupMemberRef = ref(db, 'groupMember/');
        onValue(groupMemberRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                console.log(item.val())
                if (item.val().memberId == data.uid) {
                    arr.push({ ...item.val() })
                }
            })
            setGroupMemberList(arr)
        });
    }, [])
    useEffect(() => {
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                console.log(item.val())
                if (item.val().adminId == data.uid) {
                    arr.push({ ...item.val(), })
                }
            })
            setGroupMemberList2(arr)
        });
    }, [])

    return (
        <> <div className='ml-5'>
            <h1 className='text-xl text-black'>Groups</h1>
            {
                groupMemberList.map((item) => (
                    <div className='flex justify-start items-center pt-4 w-full'>
                        <div className='pr-3.5'>
                            <picture>
                                <img src='images/group-list.png' alt='' />
                            </picture>
                        </div>
                        <div className='pr-[10px]'>
                            <p className='font-poppins text-sm font-medium text-sub'>{item.groupName}</p>
                            <h4 className='font-poppins text-lg font-semibold'></h4>
                            <p className='font-poppins text-sm font-medium text-sub'></p>
                        </div>

                    </div>
                ))
            }
            {
                groupMemberList2.map((item) => (
                    <div className='flex justify-start items-center pt-4 w-full'>
                        <div className='pr-3.5'>
                            <picture>
                                <img src='images/group-list.png' alt='' />
                            </picture>
                        </div>
                        <div className='pr-[10px]'>
                            <p className='font-poppins text-sm font-medium text-sub'>{item.groupName}</p>
                            <h4 className='font-poppins text-lg font-semibold'></h4>
                            <p className='font-poppins text-sm font-medium text-sub'></p>
                        </div>

                    </div>
                ))
            }

        </div>

        </>
    )
}

export default Chat