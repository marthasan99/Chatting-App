import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, remove, push } from "firebase/database";
import { useSelector } from 'react-redux';


const Friends = () => {
    const db = getDatabase();
    let data = useSelector(state => state.userLoginInfo.userInfo);

    let [friend, setFriend] = useState([]);
    useEffect(() => {
        const friendsRef = ref(db, 'friends/');
        onValue(friendsRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().receiverId || data.uid == item.val().senderId) {
                    arr.push({ ...item.val(), key: item.key, })
                }
            })
            setFriend(arr);
        });
    }, [])
    let handleBlock = (item) => {
        if (data.uid == item.senderId) {
            set(push(ref(db, 'blocked/')), {
                block: item.receiverName,
                blockId: item.receiverId,
                blockBy: item.senderName,
                blockById: item.senderId,
            }).then(
                remove(ref(db, 'friends/' + item.key))
            );
        } else {
            set(push(ref(db, 'blocked/')), {
                block: item.senderName,
                blockId: item.senderId,
                blockBy: item.receiverName,
                blockById: item.receiverId,
            }).then(
                remove(ref(db, 'friends/' + item.key))
            );
        }
    }

    return (

        <div className='w-full h-[462px] overflow-y-scroll rounded-lg bg-white py-3 px-5 drop-shadow-group'>
            <h3 className='font-poppins text-xl font-semibold'>Friends</h3>
            {friend.length == 0
                ?
                <p className='font-poppins mt-5 text-sm font-medium text-sub'>No friends available right now</p>
                :
                friend.map((item) => (
                    <div className='flex justify-start items-center pt-4'>
                        <div className='pr-3.5'>
                            <picture>
                                <img src='images/group-list.png' alt='' />
                            </picture>
                        </div>
                        <div className='pr-[51px]'>
                            <h4 className='font-poppins text-lg font-semibold'>
                                {
                                    item.senderId == data.uid
                                        ?
                                        item.receiverName
                                        : item.senderName
                                }
                            </h4>
                            <p className='font-poppins text-sm font-medium text-sub'>Hi Guys, Wassup!</p>
                        </div>
                        <div className=''>
                            <button onClick={() => handleBlock(item)} className='font-poppins text-xl font-semibold px-5 bg-button text-white'>Block</button>
                        </div>
                    </div>
                ))}

        </div>
    )
}

export default Friends