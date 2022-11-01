import React, {useContext, useState} from 'react';
import {AuthContext} from '../context';
import AuthService from '../API/AuthService';
import { Link } from 'react-router-dom';

import '../styles/login.css'

const Login = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const [errorMessages, setErrorMessages] = useState({});

    const errors = {
        login: "invalid login or password",
        password: "invalid password",
        confirm: "please, confirm email"
    };

    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
    );

    const login = async (event) => {
        event.preventDefault();
        const loginData = {};
        loginData.password = document.forms[0].password.value
        let login = document.forms[0].login.value;

        if (login.includes('@')) {
            loginData.email = login;
        }
        else {
            loginData.login = login;
        }

        const userData = await AuthService.login(loginData);
        console.log("userData",userData);
        if (userData.status != 200 && userData.response.status != 200) {
            const error = userData.response.data.error;
            setErrorMessages({ name: error, message: errors[error] });
        } else {
            setIsAuth(true);
        }
    }

    return (
        <div className="login-form">
            <div className="logo__container">
                <div className='logo'>
                    <span>USOF</span>
                </div>
            </div>
            <div className="auth form">
                <form onSubmit={login}>
                    <div className="container">
                        <label>Login or Email</label>
                        <input type="text" name="login" required/>
                        {renderErrorMessage("login")}
                        {renderErrorMessage("confirm")}
                    </div>
                    <div className="container">
                        <label>Password</label>
                        <input type="password" name="password" required/>
                    </div>
                    <div className="container">
                        <input type="submit" value="Sign in"/>
                    </div>
                    <div className="link__container">
                        <span>Don't have an account?</span>
                        <Link to="/sign-up">sign-up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
