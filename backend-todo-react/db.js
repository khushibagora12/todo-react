import mongoose from 'mongoose'

const schema = mongoose.Schema;
const objectId = schema.ObjectId

const user = new schema({
    name : String,
    email : String,
    password : String
})

const todos = new schema({
    userId : objectId,
    todo : String
})

export const userModel = mongoose.model("users", user)
export const todoModel = mongoose.model("todos", todos)