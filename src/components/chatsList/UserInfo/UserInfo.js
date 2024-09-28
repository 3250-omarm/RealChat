import React from "react";
import "./UserInfo.css";
import { useUserStore } from "../../../Lib/userStore";
import { signOut } from "firebase/auth";
import { auth } from "../../../Lib/Firebase";
import { useChatStore } from "../../../Lib/chatStore";
const UserInfo = () => {
  const { currentUser } = useUserStore();
  const { BeOpen } = useChatStore();
  const handleLogOut = () => {
    signOut(auth);
  };

  const openChatList = () => {
    BeOpen();
  };
  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "../../../../dep/avatar.png"} alt="" />
        <h3>{currentUser.userName}</h3>
      </div>
      <div className="icons">
        <img
          src="../../../../dep/back-arrow-icon-png-25.jpg"
          alt="Back To Chats"
          onClick={openChatList}
        />
        <img src="../../../dep/more.png" alt="" />
        <img src="../../../dep/video.png" alt="" />
        <img src="../../../dep/edit.png" alt="" />
        <img
          src="../../../../dep/logout-512.webp"
          alt=""
          onClick={handleLogOut}
        />
      </div>
    </div>
  );
};

export default UserInfo;
