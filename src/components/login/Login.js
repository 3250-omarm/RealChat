import { toast } from "react-toastify";
import "./Login.css";
import React, { useState } from "react";
import { auth, db } from "../../Lib/Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UploadImage } from "../../Lib/UploadImage";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [haveAccount, setHaveAccount] = useState(false);
  const handleUploadAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome Back");
    } catch (err) {
      toast.error("Data isnt totally correct ");
    } finally {
      setLoading(false);
    }
  };
  const handleLogUp = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { userName, email, password } = Object.fromEntries(formData);
    try {
      if (avatar.file) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const imgUrl = await UploadImage(avatar.file);
        // Add a new document in collection "users"
        await setDoc(doc(db, "users", res.user.uid), {
          userName,
          email,
          avatar: imgUrl,
          id: res.user.uid,
          blocked: [],
        });
        // Add a new document in collection "userChats"
        await setDoc(doc(db, "userChats", res.user.uid), {
          chats: [],
        });
        toast.success("Account Created Successfully !");
        setHaveAccount(true);
      } else {
        toast.error("Please Upload Your Avatar");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="logIn">
      {haveAccount && (
        <div className="item">
          <h2>Welcome back </h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button>{loading ? "Loading..." : "Sign In"}</button>
          </form>
          <span
            style={{
              textDecoration: "underLine",
              cursor: "pointer",
              color: "#1f8ef1",
            }}
            className="forwardLink"
            onClick={() => setHaveAccount(false)}
          >
            Create an Account
          </span>
        </div>
      )}
      <div className="seperator"></div>
      {!haveAccount && (
        <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handleLogUp}>
            <label htmlFor="avatar">
              <img src={avatar.url || "../../../dep/avatar.png"} alt="" />
              Upload Avatar
            </label>
            <input
              type="file"
              placeholder="Upload an Avatar"
              id="avatar"
              style={{ display: "none" }}
              onChange={handleUploadAvatar}
            />
            <input type="text" placeholder="User Name" name="userName" />

            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <span
            style={{
              textDecoration: "underLine",
              cursor: "pointer",
              color: "rgb(220, 80 ,80)",
            }}
            className="forwardLink"
            onClick={() => setHaveAccount(true)}
          >
            Already Have an Account ? Sign In
          </span>
        </div>
      )}
    </div>
  );
};

export default Login;
