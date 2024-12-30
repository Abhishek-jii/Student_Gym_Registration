import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";



const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false)
  const [token, setToken] = useState("")
  const [role,setRole] = useState('')



  return (
    <MyContext.Provider
      value={{
        setIsAuth,
        isAuth,
        token,
        setToken,
        setRole,
        role
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const UserData = () => useContext(MyContext);
