import React, { useEffect, useState } from "react";
import "./List.css";

import AddUser from "../../chat/AddUser/AddUser";
import { useUserStore } from "../../../Lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../Lib/Firebase";
import { useChatStore } from "../../../Lib/chatStore";
const List = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat, selectChat, BeOpen } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.recieverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    BeOpen();
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatRef = doc(db, "userChats", currentUser.id);
    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
      selectChat(true);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="list">
        <div className="searchBar">
          <img src="../../../dep/search.png" alt="" />
          <input
            type="text"
            placeholder="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "../../../dep/minus.png" : "../../../dep/plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      <div className="items">
        {filteredChats.map((chat) => {
          return (
            <>
              <div
                className="item"
                key={chat.chatId}
                onClick={() => handleSelect(chat)}
                style={{
                  backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                }}
              >
                <img
                  src={
                    chat.user.blocked.includes(currentUser.id)
                      ? "../../../dep/avatar.png"
                      : chat.user.avatar
                  }
                  alt=""
                />
                <div className="texts">
                  <span>
                    {chat.user.blocked.includes(currentUser.id)
                      ? "User"
                      : chat.user.userName}
                  </span>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            </>
          );
        })}

        {addMode && <AddUser />}
      </div>
    </>
  );
};

export default List;
