import axios from 'axios'
import React, { useState } from 'react'
import Config from '../utils/Config'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Toaster } from 'react-hot-toast'
import { toastError, toastSuccess } from '../utils/Toast'

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === "email") setEmail(event.target.value);
        if(event.target.name === "password") setPassword(event.target.value);
    };

    const handleLogin = async () => {
        await axios.post(Config.LoginUrl , { email, password })
        .then(function (response) { 
            localStorage.setItem('data',JSON.stringify(response.data))
            toastSuccess('Login success.')
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
            <h1>Login page</h1>
            <div id='form-login'>
                <h2>Login :</h2>
                <input type="email" placeholder='Email' value={email} onChange={handleInputChange} name="email" id="email-input" />
                <input type="password" placeholder='Password' value={password} onChange={handleInputChange} name="password" id="password-input" />
                <button id='btn-login' onClick={handleLogin}>Login</button>
                <a onClick={() => navigate("/register")}>You don't have an account ?</a>
            </div>
            <Toaster />
        </Container>
    )
}

// CSS
const Container = styled.div`


`;
