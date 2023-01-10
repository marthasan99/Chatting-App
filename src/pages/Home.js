import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoginInfo } from "../slices/userSlice";
import BlockedUser from "../components/BlockedUser";
import FriendRequest from "../components/FriendRequest";
import Friends from "../components/Friends";
import GroupList from "../components/GroupList";
import MyGroups from "../components/MyGroups";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";
import UserList from "../components/UserList";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [verified, setVerified] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
      setVerified(true);
      dispatch(userLoginInfo(user));
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  });
  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {verified ? (
        <div className="flex h-screen w-full justify-between">
          <div className="w-[186px] pl-8">
            <Sidebar active="home" />
          </div>
          <div className="w-[427px]">
            <Search />
            <GroupList />
            <FriendRequest />
          </div>
          <div className="w-[344px]">
            <Friends />
            <MyGroups />
          </div>
          <div className="w-[344px]">
            <UserList />
            <BlockedUser />
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center bg-button">
          <h1 className="text-5xl font-bold text-white">
            Please Verify your email
          </h1>
        </div>
      )}
    </>
  );
};

export default Home;
