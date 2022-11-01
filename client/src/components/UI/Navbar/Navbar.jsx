import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {AuthContext} from "../../../context";
import AuthService from '../../../API/AuthService';

import cl from './Navbar.module.css'

const Navbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = async () => {
        await AuthService.logout();
        setIsAuth(false);
    }

    return (
        <div className={cl.navbar}>
            <div className={cl.navbar__links}>
                <Link className={cl.link} to="/home"><span className={cl.link__title}>Home</span></Link>
                <Link className={cl.link} to="/posts"><span className={cl.link__title}>Posts</span></Link>
            </div>
            <div className={cl.searchbar__container}>
                <input type="text" className={cl.searchbar} placeholder='Search...'/>
            </div>
            <Link className={cl.link} onClick={logout}>
                <span className={cl.link__title}>Log Out</span>
            </Link>
            <div className={cl.logo__container}>
                <span>USOF</span>
            </div>
        </div>
    );
};

export default Navbar;