import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { useSelector } from 'react-redux';


const BlockedUser = () => {

    const db = getDatabase();
    let data = useSelector(state => state.userLoginInfo.userInfo);
    let [blockList, setBlockList] = useState([]);

    useEffect(() => {
        const blockRef = ref(db, 'blocked');
        onValue(blockRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if (item.val().blockById == data.uid) {
                    arr.push({
                        key: item.key,
                        block: item.val().block,
                        blockId: item.val().blockId,
                        blockBy: item.val().blockBy,
                        blockById: item.val().blockById,
                    })
                } else {
                    arr.push({
                        key: item.key,
                        blockBy: item.val().block,
                        block: item.val().blockBy,
                        blockId: item.val().blockById,
                    })
                }
            })
            setBlockList(arr);
        });
    }, [])
    let handleUnblock = (item) => {
        console.log("button pressed")
        set(push(ref(db, 'friends/')), {
            senderName: item.blockBy,
            senderId: item.blockById,
            receiverName: item.block,
            receiverId: item.blockId,
        }).then(
            remove(ref(db, 'blocked/' + item.key))
        )

    }
    return (
        <div className='w-full h-[462px] overflow-y-scroll rounded-lg bg-white py-3 px-5 mt-11 drop-shadow-group'>
            <h3 className='font-poppins text-xl font-semibold'>Blocked User</h3>
            {
                blockList.length == 0
                    ?
                    <p className='font-poppins mt-5 text-sm font-medium text-sub'>No Blocked User available right now</p>
                    :
                    blockList.map(item => (
                        <div className='flex justify-start items-center pt-4'>
                            <div className='pr-3.5'>
                                <picture>
                                    <img src='images/group-list.png' alt='' />
                                </picture>
                            </div>
                            <div className='pr-[51px]'>
                                <h4 className='font-poppins text-lg font-semibold'>{item.block}</h4>
                                <p className='font-poppins text-sm font-medium text-sub'>Hi Guys, Wassup!</p>
                            </div>
                            {
                                data.uid == item.blockById
                                    ?
                                    <div className=''>
                                        <button onClick={() => handleUnblock(item)} className='font-poppins text-xl font-semibold px-5 bg-button text-white'>Unb</button>
                                    </div>
                                    :
                                    <div className=''>

                                    </div>
                            }

                        </div>
                    ))
            }


        </div>
    )
}

export default BlockedUser