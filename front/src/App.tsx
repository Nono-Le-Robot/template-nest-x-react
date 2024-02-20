import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    );
  } 
