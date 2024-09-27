import { create } from "zustand";
import { useUserStore } from "./userStore";
export const useChatStore = create((set) => ({
  user: null,
  chatId: null,
  isCurrentUserBlocked: false,
  isRecievierBlocked: false,
  Open: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    //check if the currentUser is blocked

    if (user.blocked.includes(currentUser.id)) {
      return set({
        user: null,
        chatId,
        isCurrentUserBlocked: true,
        isRecievierBlocked: false,
      });
    }
    //check if the Reciever is blocked
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        user: user,
        chatId,
        isCurrentUserBlocked: false,
        isRecievierBlocked: true,
      });
    } else {
      return set({
        user,
        chatId,
        isCurrentUserBlocked: false,
        isRecievierBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({
      ...state,
      isRecievierBlocked: !state.isRecievierBlocked,
    }));
  },
  BeOpen: () => {
    set((state) => ({
      ...state,
      Open: !state.Open,
    }));
  },
}));
