import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ObjectId } from "mongoose";
import { X } from 'lucide-react';

interface Todo {
    todo: String,
    id: ObjectId
}
// const url = import.meta.env.VITE_BACKEND_URL;

export default function Todo() {
    const [todo, setTodo] = useState('')
    const [allTodos, setAllTodos] = useState<Todo[]>([])
    // const [isSignedIn, setisSignedIn] = useState(true)
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    console.log("token: ", token)
    if (!token) {
        useEffect(() => {
            navigate('/')
        }, [])

    }
    const addHandler = async (e: React.FormEvent) => {
        const todos = {
            todo: todo
        }
        // console.log(todos, "todoooooo")
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')!
            const res = await fetch('https://todo-react-dlt0.onrender.com/todos', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify(todos)
            })
            const result = await res.json()
            toast(result.message)
            setTodo('')
            getAllTodos()
        }
        catch (e: unknown) {
            console.log("error in storing todo: ", e)
        }
    }
    const getAllTodos = async () => {
        const token = localStorage.getItem('token')!
        try {
            const res = await fetch('https://todo-react-dlt0.onrender.com/getTodos', {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "authorization": token
                }
            })
            const result = await res.json()
            setAllTodos(result)

            console.log("result get- ", result)
        }
        catch (error: unknown) {
            console.log("error in fetching todod: ", error)
        }
    }
    useEffect(() => { getAllTodos() }, [])

    const logoutHandler = async () => {
        toast("Logging out...")
        setTimeout(() => {
            localStorage.setItem('token', '')
            navigate('/login')
        }, 3000)

    }
    const deleteHandler = async (id: ObjectId) => {
        console.log(id)
        const userId = {
            id: id
        }
        try {
            const token = localStorage.getItem('token')!
            const res = await fetch('https://todo-react-dlt0.onrender.com/delete', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify(userId)
            })
            const result = await res.json()
            toast("todo deleted", result.message)
            getAllTodos()
        } catch (error) {

        }
    }
    return (
        <>
            <div className="flex h-fit w-100 border-1 border-gray-300 shadow-lg shadow-gray-400 justify-center m-auto p-3 mt-40 rounded-2xl">
                <div className="w-full">
                    <h1 className="flex font-sans font-bold text-3xl m-3 justify-center">Todo List</h1>
                    <div>
                        <div className="flex m-5">
                            <input type="text" placeholder="Add a new task" className="w-[90%] rounded-2xl border-1 border-gray-500 mr-0 p-2"
                                value={todo}
                                onChange={(e) => {
                                    setTodo(e.target.value)
                                }}
                            />
                            <button onClick={addHandler} className="bg-gray-300 p-3 rounded-2xl active:bg-gray-400 border-1 border-gray-500">Add</button>
                        </div>
                    </div>
                    <div className="m-10">
                        {allTodos.map((t, index: number) => (
                            <div key={index}>
                                <div className="flex">
                                    <div>{t.todo}</div>
                                    <div className="ml-auto" onClick={() => { deleteHandler(t.id) }}><X color="red" /></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={logoutHandler} className="flex justify-center m-5 w-[90%] p-2 text-white font-bold rounded-2xl bg-red-500 active:bg-rose-600">Sign out</button>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
