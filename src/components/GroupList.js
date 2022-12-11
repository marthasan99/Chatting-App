import React, { useState, useEffect } from 'react'
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { useSelector } from 'react-redux';

const GroupList = () => {
    const db = getDatabase();
    let data = useSelector(state => state.userLoginInfo.userInfo);
    let [show, setShow] = useState(true);
    let [groupName, setGroupName] = useState("");
    let [groupNameErr, setGroupNameErr] = useState("");
    let [groupTagName, setGroupTagName] = useState("");
    let [groupTagNameErr, setGroupTagNameErr] = useState("");
    let [groupList, setGroupList] = useState([]);
    let [groupJoinRequestList, setGroupJoinRequestList] = useState([]);

    let handleGroupButton = () => {
        setShow(!show);
    }
    let handleGroupName = (e) => {
        setGroupName(e.target.value);
        setGroupNameErr("");
    }
    let handleGroupTagName = (e) => {
        setGroupTagName(e.target.value);
        setGroupTagNameErr("");
    }
    let handleCancel = () => {
        setShow(!show);
    }
    let handleCreate = () => {
        if (!groupName) {
            setGroupNameErr("Group name is required")
        }
        if (!groupTagName) {
            setGroupTagNameErr("Group Tag Name is required")
        }
        if (groupName && groupTagName) {
            set(push(ref(db, 'group/')), {
                groupName: groupName,
                groupTagName: groupTagName,
                admin: data.displayName,
                adminId: data.uid,
            }).then(() => {
                setGroupName("");
                setGroupTagName("");
            })

        }
    }
    useEffect(() => {
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (item.val().adminId != data.uid) {
                    arr.push({ ...item.val(), key: item.key })
                }
            })

            setGroupList(arr)
        });
    }, [])
    useEffect(() => {
        const groupRef = ref(db, 'groupJoinRequest/');
        onValue(groupRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().userId + item.val().key || item.val().key + item.val().userId)
            })

            setGroupJoinRequestList(arr)
        });
    }, [])


    let handleGroupJoin = (item) => {
        console.log(item)
        set(push(ref(db, 'groupJoinRequest/')), {
            ...item,
            key: item.key,
            userId: data.uid,
            userName: data.displayName,
        });

    }

    return (
        <div className='w-full h-[347px] overflow-y-scroll rounded-lg bg-white py-3 px-5 mt-11 drop-shadow-group'>
            <div className='flex justify-between'>
                <div>
                    <h3 className='font-poppins text-xl font-semibold'>Group List</h3>
                </div>
                {show &&
                    <div>
                        <button onClick={handleGroupButton} className='bg-button text-white py-2 px-4 font-semibold font-poppins text-base'>Create group</button>
                    </div>
                }

            </div>

            {show
                ?
                groupList.length == 0
                    ?
                    <p className='font-poppins mt-5 text-sm font-medium text-sub'>No group available right now</p>
                    :
                    groupList.map((item) => (
                        <div className='flex justify-start items-center pt-4'>
                            <div className='pr-3.5'>
                                <picture>
                                    <img src='images/group-list.png' alt='' />
                                </picture>
                            </div>
                            <div className='pr-[120px]'>
                                <p className='font-poppins text-sm font-medium text-sub'>{item.admin}</p>
                                <h4 className='font-poppins text-lg font-semibold'>{item.groupName}</h4>
                                <p className='font-poppins text-sm font-medium text-sub'>{item.groupTagName}</p>
                            </div>
                            {
                                groupJoinRequestList.includes(data.uid + item.key) || groupJoinRequestList.includes(item.key + data.uid)
                                    ?
                                    <div className=''>
                                        <button className='font-poppins  text-xl font-semibold px-5 bg-button text-white'>Pending</button>
                                    </div>
                                    :
                                    <div className=''>
                                        <button onClick={() => handleGroupJoin(item)} className='font-poppins  text-xl font-semibold px-5 bg-button text-white'>Join</button>
                                    </div>
                            }

                        </div>
                    ))
                :
                <div>
                    <input onChange={handleGroupName} type='text' className='border border-solid border-border-box w-full py-3 mt-3 px-2 rounded mb-2 placeholder:nunito placeholder:text-primary placeholder:text-base placeholder:font-semibold outline-none' placeholder='Group name' value={groupName}></input>

                    <p className='nunito text-red-500 text-sm font-semibold'>{groupNameErr}</p>

                    <input onChange={handleGroupTagName} type='text' className='border border-solid border-border-box w-full py-3 mt-3 px-2 rounded mb-2 placeholder:nunito placeholder:text-primary placeholder:text-base placeholder:font-semibold outline-none' placeholder='Group Tagline' value={groupTagName}></input>
                    <p className='nunito text-red-500 text-sm font-semibold'>{groupTagNameErr}</p>
                    <button onClick={handleCreate} className='bg-button w-2/5 mr-3 mt-3 py-3 nunito text-white text-xl font-semibold rounded-lg'>Create</button>
                    <button onClick={handleCancel} className='bg-red-500 w-2/5 ml-3 mt-3 py-3 nunito text-white text-xl font-semibold rounded-lg'>Cancel</button>
                </div>
            }

        </div >
    )
}

export default GroupList