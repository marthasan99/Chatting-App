import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from 'react-redux';




const UserList = () => {
    const db = getDatabase();
    let data = useSelector(state => state.userLoginInfo.userInfo);

    let [userList, setUserList] = useState([]);
    let [friendRequestList, setFriendRequestList] = useState([]);
    let [friendList, setFriendList] = useState([]);
    let [blockList, setBlockList] = useState([]);

    useEffect(() => {
        const userRef = ref(db, 'users');
        onValue(userRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if (data.uid != item.key) {
                    arr.push({ ...item.val(), userId: item.key });
                }
            })
            setUserList(arr);
        });
    }, [])

    let handleFriendRequest = (item) => {
        set(push(ref(db, 'friendRequest/')), {
            senderName: data.displayName,
            senderId: data.uid,
            receiverName: item.username,
            receiverId: item.userId,
        });

    }
    useEffect(() => {
        const friendRequestRef = ref(db, 'friendRequest');
        onValue(friendRequestRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                arr.push(item.val().senderId + item.val().receiverId)
            })
            setFriendRequestList(arr);
        });
    }, [])
    useEffect(() => {
        const friendsRef = ref(db, 'friends');
        onValue(friendsRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                arr.push(item.val().senderId + item.val().receiverId)
            })
            setFriendList(arr);
        });
    }, [])
    useEffect(() => {
        const blockRef = ref(db, 'blocked');
        onValue(blockRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                arr.push(item.val().blockId + item.val().blockById)
            })
            setBlockList(arr);
        });
    }, [])
    return (
        <div className='w-full h-[462px] overflow-y-scroll rounded-lg bg-white py-3 px-5 drop-shadow-group'>
            <h3 className='font-poppins text-xl font-semibold'>User List</h3>
            {userList.length == 0
                ?
                <p className='font-poppins mt-5 text-sm font-medium text-sub'>No Users available right now</p>
                :

                userList.map((item) => (
                    <div className='flex justify-start items-center pt-4'>
                        <div className='pr-3.5'>
                            <picture>
                                <img src='images/group-list.png' alt='' />
                            </picture>
                        </div>
                        <div className='pr-[51px]'>
                            <h4 className='font-poppins text-lg font-semibold'>{item.username}</h4>
                            <p className='font-poppins text-sm font-medium text-sub'>{item.email}</p>
                        </div>
                        <div className=''>
                            {
                                blockList.includes(data.uid + item.userId) || blockList.includes(item.userId + data.uid)
                                    ?
                                    <button className='font-poppins text-xl font-semibold px-5 bg-button text-white'>B</button>
                                    :
                                    friendList.includes(data.uid + item.userId) || friendList.includes(item.userId + data.uid)
                                        ?
                                        <button className='font-poppins text-xl font-semibold px-5 bg-button text-white'>F</button>
                                        :
                                        friendRequestList.includes(data.uid + item.userId) || friendRequestList.includes(item.userId + data.uid)
                                            ?
                                            <button className='font-poppins text-xl font-semibold px-5 bg-button text-white'>p</button>
                                            :
                                            <button onClick={() => handleFriendRequest(item)} className='font-poppins text-xl font-semibold px-5 bg-button text-white'>+</button>
                            }
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default UserList