import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from 'react-redux';




const UserList = () => {
    const db = getDatabase();
    let data = useSelector(state => state.userLoginInfo.userInfo);

    let [userList, setUserList] = useState([]);

    useEffect(() => {
        const userRef = ref(db, 'users');
        onValue(userRef, (snapshot) => {
            let arr = [];
            snapshot.forEach(item => {
                if (data.uid != item.key) {
                    arr.push(item.val());
                }
            })
            setUserList(arr);
        });
    }, [])

    return (
        <div className='w-full h-[462px] overflow-y-scroll rounded-lg bg-white py-3 px-5 drop-shadow-group'>
            <h3 className='font-poppins text-xl font-semibold'>User List</h3>
            {
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
                            <button className='font-poppins text-xl font-semibold px-5 bg-button text-white'><a href='/'>+</a></button>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default UserList