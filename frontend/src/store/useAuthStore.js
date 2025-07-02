import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_SOCKET_SERVER_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

// Initial state for the user containing initial flags.
export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  socket: null,

  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Function to check user authentication status.
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      if (response.data) {
        set({ authUser: response.data, isAuthenticated: true });
      }
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Function to sign up a new user.
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      if (response.data) {
        set({ authUser: response.data, isSignedUp: true });
        toast.success('Account created successfully');
        get().connectSocket();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Function to sign in a user.
  signIn: async (data) => {
    set({ isSigningIn: true });
    try {
      const response = await axiosInstance.post('/auth/signin', data);
      if (response.data) {
        set({ authUser: response.data, isSignedIn: true });
        toast.success('Signed in successfully');
        get().connectSocket();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningIn: false });
    }
  },

  // Function to sign out a user.
  signOut: async () => {
    try {
      const response = await axiosInstance.post('/auth/signout');
      if (response.data) {
        set({ authUser: null, isAuthenticated: false });
        toast.success('Signed out successfully');
        get().disconnectSocket();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Function to update user profile pic
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/auth/profile', data);
      if (response.data) {
        set({ authUser: response.data });
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: async () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    // Pass the auth userId in socket so we know who are the online users he/she is connected to.
    const socket = io(BASE_SOCKET_SERVER_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });

    socket.on('getOnlineUsers', (onlineUsersIds) => {
      // set({ onlineUsers: onlineUsersIds.filter((id) => id !== authUser._id) });
      set({ onlineUsers: onlineUsersIds });
    });
  },
  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
