import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
  chats: [],
  users: [],
  selectedUser: null,
  isLoadingUsersList: false,
  isLoadingChatList: false,

  getUsers: async () => {
    set({ isLoadingUsersList: true });
    try {
      const response = await axiosInstance.get('/chats/users');
      if (response) {
        set({ users: response.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingUsersList: false });
    }
  },
  getChats: async (userId) => {
    set({ isLoadingChatList: true });
    try {
      const response = await axiosInstance.get(`/chats/users/${userId}`);
      if (response) {
        set({ chats: response.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingChatList: false });
    }
  },
  sendChat: async (data) => {
    try {
      const { selectedUser, chats } = get();
      const response = await axiosInstance.post(`/chats/users/${selectedUser._id}`, data);
      if (response) {
        // This will append the response data to the chats array.
        set({ chats: [...chats, response.data] });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingChatList: false });
    }
  },
  // Needs optimization later
  subscribedChats: () => {
    const selectedUser = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('newChat', (newChat) => {
      const isChatSentFromSelectedUser = newChat.senderId === selectedUser._id;
      if (isChatSentFromSelectedUser) return;
      set({ chats: [...get().chats, newChat] });
    });
  },
  unSubscribedChats: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off('newChat');
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
