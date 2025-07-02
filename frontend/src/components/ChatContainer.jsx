import { useChatStore } from '../store/useChatStore';
import { useEffect, useRef } from 'react';

import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const { chats, getChats, isLoadingChatList, selectedUser, subscribedChats, unSubscribedChats } =
    useChatStore();
  const { authUser } = useAuthStore();
  const chatEndRef = useRef(null);

  // Get the chats between the logged in user and the selected user Id
  // When ever the selected user changes, We need to run the
  useEffect(() => {
    getChats(selectedUser._id);
    subscribedChats();
    return () => {
      // When the component is unmounted i.e. clean up, We need to unsubscribe from the socket
      unSubscribedChats();
    };
  }, [selectedUser._id, getChats, subscribedChats, unSubscribedChats]);

  // Whenever the messages changes, We need to scroll to the bottom
  useEffect(() => {
    if (!chats) return;
    if (chats && chatEndRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  if (isLoadingChatList) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }

  console.log('chats', chats);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat ${chat.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            ref={chatEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    chat.senderId === authUser._id
                      ? authUser.profilePic || '/avatar.png'
                      : selectedUser.profilePic || '/avatar.png'
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(chat.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {chat.image && (
                <img
                  src={chat.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {chat.text && <p>{chat.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <ChatInput />
    </div>
  );
};
export default ChatContainer;
