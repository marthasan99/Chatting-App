import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const MyGroups = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [groupList, setGroupList] = useState([]);
  let [groupRequestList, setGroupRequestList] = useState([]);
  let [show, setShow] = useState(false);
  let [showGroupMember, setShowGroupMember] = useState(false);
  let [groupMemberList, setGroupMemberList] = useState([]);

  useEffect(() => {
    const groupRef = ref(db, "group/");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().adminId == data.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupList(arr);
    });
  }, []);

  let handleRequestShow = (requestItem) => {
    setShow(!show);
    const groupRequestRef = ref(db, "groupJoinRequest/");
    onValue(groupRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().adminId == data.uid &&
          item.val().key == requestItem.key
        ) {
          arr.push({ ...item.val(), id: item.key });
        }
      });

      setGroupRequestList(arr);
    });
  };
  let handleGoBack = () => {
    setShow(!show);
  };
  let handleGoGroupBack = () => {
    setShowGroupMember(!showGroupMember);
  };
  let handleReject = (item) => {
    remove(ref(db, "groupJoinRequest/" + item.id));
  };
  let handleGroupAccept = (item) => {
    set(push(ref(db, "groupMember/")), {
      groupId: item.key,
      memberId: item.userId,
      memberName: item.userName,
      admin: item.admin,
      adminId: item.adminId,
      groupName: item.groupName,
      groupTagName: item.groupTagName,
    }).then(() => {
      remove(ref(db, "groupJoinRequest/" + item.id));
      setShow(!show);
    });
  };
  let handleInfo = (gitem) => {
    setShowGroupMember(!showGroupMember);
    const groupMemberRef = ref(db, "groupMember/");
    onValue(groupMemberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (gitem.adminId == data.uid && item.val().groupId == gitem.key) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setGroupMemberList(arr);
    });
  };
  let handleKickOut = (item) => {
    console.log(item);
    remove(ref(db, "groupMember/" + item.key));
  };

  return (
    <>
      <div className="mt-11 h-[462px] w-full overflow-y-scroll rounded-lg bg-white py-3 px-5 drop-shadow-group">
        <h3 className="inline font-poppins text-xl font-semibold">My Groups</h3>
        <div className="float-right inline">
          {show && (
            <button
              onClick={handleGoBack}
              className="bg-button py-2 px-4 font-poppins text-base font-semibold text-white"
            >
              Go Back
            </button>
          )}
          {showGroupMember && (
            <button
              onClick={handleGoGroupBack}
              className="bg-button py-2 px-4 font-poppins text-base font-semibold text-white"
            >
              Go Back
            </button>
          )}
        </div>
        {groupList.length == 0 ? (
          <p className="mt-5 font-poppins text-sm font-medium text-sub">
            No groups available right now
          </p>
        ) : show ? (
          groupRequestList.map((item) => (
            <>
              <div className="flex w-full items-center justify-start pt-4">
                <div className="pr-3.5">
                  <picture>
                    <img src="images/group-list.png" alt="" />
                  </picture>
                </div>
                <div className="pr-[10px]">
                  <h4 className="font-poppins text-lg font-semibold">
                    {item.userName}
                  </h4>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleGroupAccept(item)}
                  className="ml-8 mr-10 bg-button px-5 font-poppins text-base font-semibold text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(item)}
                  className="bg-red-500 px-5 font-poppins text-base font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            </>
          ))
        ) : showGroupMember ? (
          groupMemberList.map((item) => (
            <>
              <div className="flex w-full items-center justify-start pt-4">
                <div className="pr-3.5">
                  <picture>
                    <img src="images/group-list.png" alt="" />
                  </picture>
                </div>
                <div className="pr-[10px]">
                  <h4 className="font-poppins text-lg font-semibold">
                    {item.memberName}
                  </h4>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleKickOut(item)}
                  className="bg-red-500 px-5 font-poppins text-base font-semibold text-white"
                >
                  Kick Out
                </button>
              </div>
            </>
          ))
        ) : (
          groupList.map((item) => (
            <>
              <div className="flex w-full items-center justify-start pt-4">
                <div className="pr-3.5">
                  <picture>
                    <img src="images/group-list.png" alt="" />
                  </picture>
                </div>
                <div className="pr-[10px]">
                  <p className="font-poppins text-sm font-medium text-sub">
                    {"Admin:" + item.admin}
                  </p>
                  <h4 className="font-poppins text-lg font-semibold">
                    {item.groupName}
                  </h4>
                  <p className="font-poppins text-sm font-medium text-sub">
                    {item.groupTagName}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleInfo(item)}
                  className="ml-8 mr-10 bg-button px-5 font-poppins text-base font-semibold text-white"
                >
                  Info
                </button>
                <button
                  onClick={() => handleRequestShow(item)}
                  className="relative bg-button px-5 font-poppins text-base font-semibold text-white"
                >
                  Requests
                  {groupRequestList.length > 0 && (
                    <span className="absolute right-0 top-0 h-5 w-5 translate-x-[50%] translate-y-[-50%] rounded-full bg-red-500">
                      {groupRequestList.length}
                    </span>
                  )}
                </button>
              </div>
            </>
          ))
        )}
      </div>
    </>
  );
};

export default MyGroups;
