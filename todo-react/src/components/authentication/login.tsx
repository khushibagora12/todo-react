import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"

export default function Login() {
        const [email ,setEmail] = useState('')
        const [password ,setPassword] = useState('')
        const navigate = useNavigate();

        const submitHandler = async (e: React.FormEvent) => {
            e.preventDefault()
            if(email === '' || password === ''){
                toast("empty field");
                return;
            }
            const data = {
                email: email,
                password: password
            }
            console.log(data)
            try {
                const res = await fetch('https://todo-react-nine-topaz.vercel.app/login', {
                    method : "POST",
                    headers: {
                        "content-type" : "application/json",
                    },
                    body : JSON.stringify(data)
                })
                const result = await res.json()
                console.log(res)
                console.log(result)
                console.log(result.token)
                localStorage.setItem("token", result.token)
                toast(result.message)
                setEmail('')
                setPassword('')
                if(result.message === 'user signed In successfully'){
                setTimeout(() => {
                    navigate('/todo')
                }, 3000)
            
            }
    
            } 
            catch (error: unknown) {
                console.log("error in taking signup input: ", error)
            }
        }
    return (
        <>
            <div className="flex h-80 w-80  border-1 border-gray-300 shadow-lg shadow-gray-400 justify-center text-center m-auto mt-40 rounded-2xl">
                <div >
                    <div>
                        <h2 className="text-3xl font-bold m-5">Sign In</h2>
                        <div>
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
                        <button onClick={submitHandler} className="m-2 p-2 border-1 border-gray-400 bg-gray-300 w-[75%] rounded-2xl active:bg-gray-400">Sign In</button>
                        </div>
                    </div>
                    <div className="m-5">
                        Don't have an account? <span className="text-blue-600" ><Link to='/'>Sign up</Link></span>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}