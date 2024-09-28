import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Lib/Firebase";
import { useChatStore } from "../../Lib/chatStore";
import { useUserStore } from "../../Lib/userStore";
import upload from "../../Lib/upload";

const Chat = () => {
  const [emojiOn, setEmojiOn] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [chat, setChat] = useState([]);
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isRecievierBlocked,
    BeOpen,
    Open,
  } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const refMessage = useRef(null);

  useEffect(() => {
    refMessage.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        document.getElementById("clickBtn").click();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);
  const handleEmoji = (e) => {
    setInputMessage((prev) => prev + e.emoji);
    setEmojiOn(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    let imgUrl = null;
    if (img.file) {
      imgUrl = await upload(img.file);
    }
    if (inputMessage === " ") {
      return;
    } else {
      try {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            text: inputMessage,
            createdAt: new Date(),
            ...(imgUrl && { img: imgUrl }),
          }),
        });
        const userIds = [currentUser.id, user.id];
        userIds.forEach(async (id) => {
          const userChatRef = doc(db, "userChats", id);
          const userSnapShot = await getDoc(userChatRef);
          if (userSnapShot.exists()) {
            const userChatsData = userSnapShot.data();

            const chatIndex = userChatsData.chats.findIndex(
              (chat) => chat.chatId === chatId
            );
            if (chatIndex !== -1) {
              userChatsData.chats[chatIndex].lastMessage = inputMessage;
              userChatsData.chats[chatIndex].isSeen =
                id === currentUser.id ? true : false;
              userChatsData.chats[chatIndex].updatedAt = Date.now();

              await updateDoc(userChatRef, {
                chats: userChatsData.chats,
              });
            } else {
              // Optionally handle the case where the chatId is not found
              console.warn(
                `Chat with chatId ${chatId} not found for user ${id}`
              );
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    setImg({
      file: null,
      url: "",
    });
    setInputMessage("");
  };
  const handleBack = () => {
    BeOpen();
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img
            src={
              isCurrentUserBlocked || isRecievierBlocked
                ? "../../../dep/avatar.png"
                : user?.avatar
            }
            alt=""
          />
          <div className="texts">
            <span>
              {isCurrentUserBlocked || isRecievierBlocked
                ? "User"
                : user.userName}
            </span>
            <p>{user?.description}</p>
          </div>
        </div>
        <div className="icons">
          {Open && (
            <img
              src="../../../dep/back-arrow-icon-png-25.jpg"
              alt=""
              onClick={handleBack}
            />
          )}
          <img src="../../../dep/phone.png" alt="" />
          <img src="../../../dep/video.png" alt="" />
          <img src="../../../dep/info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message, index) => {
          return (
            <div
              className={
                message.senderId === currentUser.id
                  ? "message owner"
                  : "message"
              }
              key={index}
            >
              <div className="texts">
                {message.img && (
                  <img
                    src={message.img}
                    alt=""
                    className={openImage && "OpenedImage"}
                    onClick={() => setOpenImage(!openImage)}
                  />
                )}
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
        {img.url && (
          <div className="message owner">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={refMessage}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label
            htmlFor="img"
            disabled={isCurrentUserBlocked || isRecievierBlocked}
          >
            <img src="../../../dep/img.png" alt="" />
          </label>
          <input
            type="file"
            id="img"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="../../../dep/camera.png" alt="" />
          <img src="../../../dep/mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isRecievierBlocked
              ? "you can't send a message"
              : "Type a message ..."
          }
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          disabled={isCurrentUserBlocked || isRecievierBlocked}
        />
        <div className="emoji">
          <img
            src="../../../dep/emoji.png"
            alt=""
            onClick={() => setEmojiOn((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={emojiOn} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          id="clickBtn"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isRecievierBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
