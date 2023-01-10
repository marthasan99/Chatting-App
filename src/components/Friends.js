import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { activeChat } from "../slices/activeChatSlice";

const Friends = () => {
  const db = getDatabase();
  let dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [friend, setFriend] = useState([]);
  useEffect(() => {
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().receiverId ||
          data.uid == item.val().senderId
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriend(arr);
    });
  }, []);
  let handleBlock = (item) => {
    if (data.uid == item.senderId) {
      set(push(ref(db, "blocked/")), {
        block: item.receiverName,
        blockId: item.receiverId,
        blockBy: item.senderName,
        blockById: item.senderId,
      }).then(remove(ref(db, "friends/" + item.key)));
    } else {
      set(push(ref(db, "blocked/")), {
        block: item.senderName,
        blockId: item.senderId,
        blockBy: item.receiverName,
        blockById: item.receiverId,
      }).then(remove(ref(db, "friends/" + item.key)));
    }
  };
  let handleActiveSingle = (item) => {
    if (item.receiverId == data.uid) {
      dispatch(
        activeChat({
          status: "single",
          id: item.senderId,
          name: item.senderName,
        })
      );
      localStorage.setItem(
        "activeChat",
        JSON.stringify({
          status: "single",
          id: item.senderId,
          name: item.senderName,
        })
      );
    } else {
      dispatch(
        activeChat({
          status: "single",
          id: item.receiverId,
          name: item.receiverName,
        })
      );
      localStorage.setItem(
        "activeChat",
        JSON.stringify({
          status: "single",
          id: item.receiverId,
          name: item.receiverName,
        })
      );
    }
  };

  return (
    <div className="h-[462px] w-full overflow-y-scroll rounded-lg bg-white py-3 px-5 drop-shadow-group">
      <h3 className="font-poppins text-xl font-semibold">Friends</h3>
      {friend.length == 0 ? (
        <p className="mt-5 font-poppins text-sm font-medium text-sub">
          No friends available right now
        </p>
      ) : (
        friend.map((item) => (
          <div
            onClick={() => handleActiveSingle(item)}
            className="flex items-center justify-start pt-4"
          >
            <div className="pr-3.5">
              <picture>
                <img src="images/group-list.png" alt="" />
              </picture>
            </div>
            <div className="pr-[51px]">
              <h4 className="font-poppins text-lg font-semibold">
                {item.senderId == data.uid
                  ? item.receiverName
                  : item.senderName}
              </h4>
              <p className="font-poppins text-sm font-medium text-sub">
                Hi Guys, Wassup!
              </p>
            </div>
            <div className="">
              <button
                onClick={() => handleBlock(item)}
                className="bg-button px-5 font-poppins text-xl font-semibold text-white"
              >
                Block
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Friends;
