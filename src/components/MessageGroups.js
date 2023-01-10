import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { useSelector } from "react-redux";

const MessageGroup = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [show, setShow] = useState(true);
  let [groupName, setGroupName] = useState("");
  let [groupNameErr, setGroupNameErr] = useState("");
  let [groupTagName, setGroupTagName] = useState("");
  let [groupTagNameErr, setGroupTagNameErr] = useState("");
  let [groupList, setGroupList] = useState([]);
  let [groupJoinRequestList, setGroupJoinRequestList] = useState([]);

  let handleGroupButton = () => {
    setShow(!show);
  };
  let handleGroupName = (e) => {
    setGroupName(e.target.value);
    setGroupNameErr("");
  };
  let handleGroupTagName = (e) => {
    setGroupTagName(e.target.value);
    setGroupTagNameErr("");
  };
  let handleCancel = () => {
    setShow(!show);
  };
  let handleCreate = () => {
    if (!groupName) {
      setGroupNameErr("Group name is required");
    }
    if (!groupTagName) {
      setGroupTagNameErr("Group Tag Name is required");
    }
    if (groupName && groupTagName) {
      set(push(ref(db, "group/")), {
        groupName: groupName,
        groupTagName: groupTagName,
        admin: data.displayName,
        adminId: data.uid,
      }).then(() => {
        setGroupName("");
        setGroupTagName("");
      });
    }
  };
  useEffect(() => {
    const groupRef = ref(db, "group/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });

      setGroupList(arr);
    });
  }, []);
  useEffect(() => {
    const groupRef = ref(db, "groupJoinRequest/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(
          item.val().userId + item.val().key ||
            item.val().key + item.val().userId
        );
      });

      setGroupJoinRequestList(arr);
    });
  }, []);

  return (
    <div className="mt-11 h-[347px] w-full overflow-y-scroll rounded-lg bg-white py-3 px-5 drop-shadow-group">
      <div className="flex justify-between">
        <div>
          <h3 className="font-poppins text-xl font-semibold">Group List</h3>
        </div>
      </div>

      {show ? (
        groupList.length == 0 ? (
          <p className="mt-5 font-poppins text-sm font-medium text-sub">
            No group available right now
          </p>
        ) : (
          groupList.map((item) => (
            <div className="flex items-center justify-start pt-4">
              <div className="pr-3.5">
                <picture>
                  <img src="images/group-list.png" alt="" />
                </picture>
              </div>
              <div className="pr-[120px]">
                <p className="font-poppins text-sm font-medium text-sub">
                  {item.admin}
                </p>
                <h4 className="font-poppins text-lg font-semibold">
                  {item.groupName}
                </h4>
                <p className="font-poppins text-sm font-medium text-sub">
                  {item.groupTagName}
                </p>
              </div>
              <div className="">
                <button className="bg-button  px-5 font-poppins text-xl font-semibold text-white">
                  Msg
                </button>
              </div>
            </div>
          ))
        )
      ) : (
        <div>
          <input
            onChange={handleGroupName}
            type="text"
            className="border-border-box placeholder:nunito mt-3 mb-2 w-full rounded border border-solid py-3 px-2 outline-none placeholder:text-base placeholder:font-semibold placeholder:text-primary"
            placeholder="Group name"
            value={groupName}
          ></input>

          <p className="nunito text-sm font-semibold text-red-500">
            {groupNameErr}
          </p>

          <input
            onChange={handleGroupTagName}
            type="text"
            className="border-border-box placeholder:nunito mt-3 mb-2 w-full rounded border border-solid py-3 px-2 outline-none placeholder:text-base placeholder:font-semibold placeholder:text-primary"
            placeholder="Group Tagline"
            value={groupTagName}
          ></input>
          <p className="nunito text-sm font-semibold text-red-500">
            {groupTagNameErr}
          </p>
          <button
            onClick={handleCreate}
            className="nunito mr-3 mt-3 w-2/5 rounded-lg bg-button py-3 text-xl font-semibold text-white"
          >
            Create
          </button>
          <button
            onClick={handleCancel}
            className="nunito ml-3 mt-3 w-2/5 rounded-lg bg-red-500 py-3 text-xl font-semibold text-white"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageGroup;
