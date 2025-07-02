import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

import { generateToken } from "../lib/utils.js"

import User from "../models/user.model.js"

export const signup = async (req, res) => {
  // res.send("Signup Page");
  const { email, fullName, password } = req.body
  try {
    if (!email || !fullName || !password)
      return res.status(400).json({ message: "All fields are required" })

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 chars in length" })

    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "Email already exists" })

    const salt = await bcrypt.genSalt(10) 
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      email: email,
      fullName: fullName,
      password: hashedPassword,
    })

    if (!newUser)
      return res.status(400).json({ message: "Error in creating the user" })

    await newUser.save()
    generateToken(newUser._id, res)

    res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    })
  } catch (error) {
    console.log("Error in singup controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const signin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" })

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 chars in length" })

    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword)
      return res.status(400).json({ message: "Invalid credentials" })

    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log("Error in signin controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const signout = (req, res) => {
  try {
    res.cookie("jwt_cookie", "", { maxAge: 0 })
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in signout controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" })

    // Upload the profile pic to cloudinary
    const uploadProfilePicResponse = await cloudinary.uploader.upload(
      profilePic
    )

    // Returns the current user object unless sending {new: true} which will return the updated user object
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadProfilePicResponse.secure_url },
      { new: true }
    )

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    })
  } catch (error) {
    console.log("Error in updateProfile controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller", error.message)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
