import "./App.css";
import "./components/mediaQueries/mediaQueries.css";
import ChatsList from "./components/chatsList/chatsList";
import Chat from "./components/chat/chat";
import Details from "./components/details/details";
import Login from "./components/login/Login";
import Notification from "./components/Notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Lib/Firebase";
import { useUserStore } from "./Lib/userStore";
import { useChatStore } from "./Lib/chatStore";
function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, Open } = useChatStore();
  //we must keep track of the current user not lose him so
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      console.log(user);
    });
    return () => unSub();
  }, [fetchUserInfo]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      {currentUser ? (
        <>
          <ChatsList />
          {chatId && Open && <Chat />}
          {chatId && Open && <Details />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
}
export default App;
