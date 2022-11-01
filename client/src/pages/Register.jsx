import React, {useContext} from "react";
import {AuthContext} from "../context";
import AuthService from '../API/AuthService';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const redirect = useNavigate();
    
    const register = async (event) => {
        event.preventDefault();

        const registerData = {};
        registerData.login = document.forms[0].login.value;
        registerData.password = document.forms[0].password.value;
        registerData.email = document.forms[0].email.value;

        const userData = await AuthService.register(registerData);
        if (userData) {
            redirect('/sign-in');
        } 
        else {
            
        }
    }

    return (
        <div className="register-form">
            <div className="logo__container">
                <div className='logo'>
                    <span>USOF</span>
                </div>
            </div>
            <div className="auth form">
                <form onSubmit={register}>
                    <div className="container">
                        <label>Login</label>
                        <input type="text" name="login" required/>
                    </div>
                    <div className="container">
                        <label>Password</label>
                        <input type="password" name="password" required/>
                    </div>
                    <div className="container">
                        <label>Confirm password</label>
                        <input type="password" name="confirm_password" required/>
                    </div>
                    <div className="container">
                        <label>Email</label>
                        <input type="text" name="email" required/>
                    </div>
                    <div className="container">
                        <input type="submit" value="Sign up"/>
                    </div>
                    <div className="link__container">
                        <span>Already have an account?</span>
                        <Link to="/sign-in">sign-in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;