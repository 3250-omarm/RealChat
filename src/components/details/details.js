import React from "react";
import "./details.css";

import { signOut } from "firebase/auth";
import { auth, db } from "../../Lib/Firebase";
import { useChatStore } from "../../Lib/chatStore";
import { useUserStore } from "../../Lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
const Details = () => {
  const { user, isCurrentUserBlocked, isRecievierBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isRecievierBlocked
          ? arrayRemove(user.id)
          : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete =()=>{
  }
  return (
    <div className="details">
      <div className="user">
        <img
          src={
            isCurrentUserBlocked || isRecievierBlocked
              ? "../../../dep/avatar.png"
              : user?.avatar
          }
          alt=""
        />
        <h2>
          {isCurrentUserBlocked || isRecievierBlocked ? "User" : user?.userName}
        </h2>
        <p>{user?.description}</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="../../../dep/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="../../../dep/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="../../../dep/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="../../../dep/arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
            <div className="photoItems">
              <div className="photoDetails">
                <img
                  src="https://thumbs.dreamstime.com/b/young-conceptual-image-large-stone-shape-human-brain-conceptual-image-large-stone-shape-110748113.jpg"
                  alt=""
                />
                <span>New Photo</span>
              </div>
              <img
                src="../../../dep/download.png"
                alt=""
                className="downloadIcon"
              />
            </div>
          </div>
        </div>
        <button style={{backgroundColor:'slateblue'}} onClick={handleDelete}>
          Clear all chats
        </button>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isRecievierBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button className="logOut" onClick={() => signOut(auth)}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Details;
