import React, { useEffect } from "react";
import Chat from "../components/Chat";
import Friends from "../components/Friends";
import MessageGroup from "../components/MessageGroups";
import Search from "../components/Search";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const Message = () => {
  return (
    <div className="flex h-screen w-full justify-between">
      <div className="w-[186px] pl-8">
        <Sidebar active="message" />
      </div>
      <div className="mt-7 w-[427px]">
        <Search />
        <div className="mt-2.5 mb-5">
          <MessageGroup />
        </div>
        <Friends />
      </div>
      <div className="mt-7 w-[700px]">
        <Chat />
      </div>
    </div>
  );
};

export default Message;
