import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Config from '../utils/Config';
import styled from 'styled-components';
import { toastError, toastSuccess } from '../utils/Toast';
import { Toaster } from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === "username") setUsername(event.target.value);
        if(event.target.name === "email") setEmail(event.target.value);
        if(event.target.name === "password") setPassword(event.target.value);
        if(event.target.name === "repeat-password") setRepeatPassword(event.target.value)
    }; 

    const handleRegister  = () => {
        const regExpMail = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
        if(username === "" || email === "" || password === "") return toastError("All fields are needed.")
        if(!regExpMail.test(email)) return toastError("Invalid email address.");
        if(password !== repeatPassword) return toastError("Password must be the same.")
        axios.post(Config.registerUrl , {
            username : username,
            email : email,
            password : password
        })
        .then(async function() {
            toastSuccess("Register success.")
            await axios.post(Config.LoginUrl , { email, password })
            .then(function (response) { 
                setTimeout(() => {
                    localStorage.setItem('data',JSON.stringify(response.data))
                    // navigate('/')
                },1000)
            })
            .catch(function (error) { 
                navigate('/login')
            });
        })
        .catch(function (error) {
            const result : Array<string> | string = error.response.data.message
            if(result instanceof Array)
            result.forEach(error => {
                toastError(error);
            });
            else{
                toastError(result);
            }
        });
    }

    return (
        <Container>
            <h1>Register page</h1>
            <div id='form-register'>
                <h2>Register :</h2>
                <input type="text" value={username} onChange={handleInputChange} placeholder='username' name="username" id="username-input" />
                <input type="email" value={email} onChange={handleInputChange}  name="email" placeholder='email' id="email-input" />
                <input type="password" value={password} onChange={handleInputChange} name="password" placeholder='password' id="password-input" />
                <input type="password" value={repeatPassword} onChange={handleInputChange} name="repeat-password" placeholder='repeat password' id="repeat-password-input" />
                <button id='btn-register' onClick={handleRegister}>Register</button>
                <a onClick={() => navigate("/login")}>You already have an account ?</a>
            </div>
            <Toaster />
        </Container>
    )
}

// CSS
const Container = styled.div`

`;

