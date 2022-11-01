import React, { useState, useEffect } from 'react'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {AuthContext} from "./context";
import AuthService from "./API/AuthService";
import {parseCookie} from './utils/parseCookie';
import Navbar from './components/UI/Navbar/Navbar';
import "./styles/main.css"

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let token = parseCookie(document.cookie)?.token;  
      if (token) {
        const userData = await AuthService.login({token: token});
        if (userData) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
      }
      setLoading(false);
    })()
  }, [])

  return (
    <AuthContext.Provider value={{
          isAuth,
          setIsAuth,
          isLoading
      }}>
        <BrowserRouter>
            {isAuth && <Navbar/>}
            <AppRouter/>
        </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
