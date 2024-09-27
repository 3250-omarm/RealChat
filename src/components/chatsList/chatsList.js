import React, { useState } from "react";
import "./chatsList.css";
import List from "./List/List";
import UserInfo from "./UserInfo/UserInfo";
import { useChatStore } from "../../Lib/chatStore";
const ChatsList = () => {
const {Open} = useChatStore()
  return (
    <>
      {!Open && <div className="chatsList">
        <UserInfo />
        <List/>
      </div>}
    </>
  );
};

export default ChatsList;
