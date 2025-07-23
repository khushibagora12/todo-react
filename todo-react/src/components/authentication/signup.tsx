import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
const url = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
    const [name ,setName] = useState('')
    const [email ,setEmail] = useState('')
    const [password ,setPassword] = useState('')
    const navigate = useNavigate()

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if(name === '' || email === '' || password === ''){
            toast("empty field");
            return;
        }
        const data = {
            name: name,
            email: email,
            password: password
        }
        try {
            const res = await fetch(`${url}signup`, {
                method : "POST",
                headers: {
                    "content-type" : "application/json"
                },
                body : JSON.stringify(data)
            })
            const result = await res.json()
            console.log(result)
            toast(result.message)
            setName('')
            setEmail('')
            setPassword('')
            if(result.message === 'user created'){
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            
            }

        } 
        catch (error: unknown) {
            console.log("error in taking signup input: ", error)
        }
    }
    return (
        <>
            <div className="flex h-95 w-80 border-1 border-gray-300 shadow-lg shadow-gray-400 justify-center text-center m-auto mt-40 rounded-2xl">
                <div>
                    <div>
                        <h2 className="text-3xl font-bold m-5">Sign Up</h2>
                        <div>
                            <input type="text" placeholder="Name" className="p-2 border-1 border-gray-300 rounded-2xl m-2" 
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            />
                        </div>
                        <div>
                            <input type="email" placeholder="Email" className="p-2 border-1 border-gray-300 rounded-2xl m-2" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            />
                        </div>
                        <div>
                            <input type="password" placeholder="Password" className="p-2 border-1 border-gray-300 rounded-2xl m-2"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            />
                        </div>
                        <div>
                        <button onClick={submitHandler} className="m-2 p-2 border-1 border-gray-400 bg-gray-300 w-[75%] rounded-2xl active:bg-gray-400">Sign up</button>
                        </div>
                    </div>
                    <div className="m-5">
                        Already have an account? <span className="text-blue-600" ><Link to="/login">Sign in</Link></span>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}