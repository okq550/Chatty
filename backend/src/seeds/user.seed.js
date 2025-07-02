import { config } from "dotenv"
import { connectDB } from "../lib/db.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

config()

let counter = 0
let seedUsers = []

const salt = await bcrypt.genSalt(10)  
const hashedPassword = await bcrypt.hash("123456", salt)

for (counter = 0; counter < 10; counter++) {
  let user = {
    email: `user${counter}@example.com`,
    fullName: `User ${counter}`,
    password: hashedPassword,
    profilePic: `https://randomuser.me/api/portraits/men/${counter}.jpg`,
  }
  seedUsers[counter] = user
}

for (counter; counter < 20; counter++) {
  let user = {
    email: `user${counter}@example.com`,
    fullName: `User ${counter}`,
    password: hashedPassword,
    profilePic: `https://randomuser.me/api/portraits/women/${counter}.jpg`,
  }
  seedUsers[counter] = user
}

const seedDatabase = async () => {
  try {
    await connectDB()

    await User.insertMany(seedUsers)
    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Call the function
seedDatabase()
