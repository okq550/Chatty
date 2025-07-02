import User from "../models/user.model.js"
import Chat from "../models/chat.model.js"
import cloudinary from "../lib/cloudinary.js"
import { io, getReceiverSocketId } from "../lib/socket.js"

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id
    // Get all users except the logged in user, Return all fields except the password field.
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    )
    return res.status(200).json(users)
  } catch (error) {
    console.log("Error in getUsers controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getChats = async (req, res) => {
  try {
    // Receive the path param id and rename to userToChatId
    const { id: userToChatId } = req.params
    const currentUserId = req.user._id
    const chats = await Chat.find({
      $or: [
        { senderId: currentUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUserId },
      ],
    })
    return res.status(200).json(chats)
  } catch (error) {
    console.log("Error in getChats controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const sendChat = async (req, res) => {
  try {
    const { id: receiverId } = req.params
    const { text, image } = req.body
    const senderId = req.user._id
    let imageUrl

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newChat = new Chat({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newChat.save()

    // Send the chat directly to the receiver socket Id
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newChat", newChat)
    }

    res.status(201).json({
      _id: newChat._id,
      senderId: newChat.senderId,
      receiverId: newChat.receiverId,
      text: newChat.text,
      profilePic: newChat.profilePic,
    })
  } catch (error) {
    console.log("Error in newChat controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
