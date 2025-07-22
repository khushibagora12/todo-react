import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/authentication/login'
import Signup from './components/authentication/signup'
import Todo from './components/todo/todo';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/todo' element={<Todo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
