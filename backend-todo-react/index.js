import express from 'express'
import bcrypt from 'bcrypt'
import { userModel, todoModel } from './db.js'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const port = process.env.PORT || 8000
// console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI);

const app = express()

app.use(express.json())
app.use(cors())
app.post('/signup', async (req, res) => {
    console.log("in here")
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const ifExist = await userModel.findOne({ email: email })
        if (ifExist) {
            res.json({ message: "user already exist!" })
            return;
        }
        await userModel.create({
            name,
            email,
            password: hashedPassword
        })
        res.json({ message: "user created" })

    } catch (error) {
        res.json({ message: error || "something went wrong" }).status(500)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await userModel.findOne({ email: email })
        if (!findUser) {
            res.json({ message: "user doesn't exist!" })
            return;
        }
        const isVerified = await bcrypt.compare(password, findUser.password)
        if (!isVerified) {
            res.json({ message: "wrong password" })
            return;
        }
        const token = jwt.sign({ id: findUser._id.toString() }, JWT_SECRET)
        // console.log("signin token: ", token)
        res.json({
            message: "user signed In successfully",
            token: token
        })

    } catch (error) {
        res.json({ message: error || "something went wrong" }).status(500)
    }
})

app.use(authMiddleware)
app.post('/todos', async (req, res) => {
    // console.log("in todos")
    try {
        // console.log("in try block")
        const userId = req.userId;
        // console.log("after userId: ", userId)
        const { todo } = req.body;
        // console.log("after todo")

        // console.log("user todos: ", todo, " ", userId)

        await todoModel.create({
            todo,
            userId
        })
        res.json({ message: "todo added" })

    } catch (error) {
        console.log("in catch: ", error)
        res.json({ message: error || "something went wrong" }).status(500)
    }
})

app.get('/getTodos', async (req, res) => {
    try {
        const userTodos = await todoModel.find({
            userId: req.userId,
        })
        if (userTodos) {
            res.json(userTodos)
        } else {
            res.json({ message: "no todo found" })
        }
    } catch (error) {
        res.json({ message: error || "something went wrong" }).status(500)
    }
})
app.post('/delete', async (req, res) => {
    try {
        const {id} = req.body
        console.log(id)
        const find = await todoModel.findByIdAndDelete({id})
        if(find){
            res.json({messgae: "todo deleted"})
        }
    } catch (error) {
        res.json({ message: error || "something went wrong" }).status(500)
    }
})

function authMiddleware(req, res, next) {

    const token = req.headers.authorization
    // console.log("token: ", token)
    if (token) {
        const user = jwt.verify(token, JWT_SECRET)
        console.log("jwt verify", user)
        if (user) {
            req.userId = user.id;
            next();
        } else {
            res.status(404).send("error");
        }
    }
}

app.listen(port)
