import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";



const myContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [token, setToken] = useState("")




  return (
    <MyContextProvider.Provider
      value={{
        setUser,
        setIsAuth,
        user,
        isAuth,
        token,
        setToken
      }}
    >
      {children}
      <Toaster />
    </MyContextProvider.Provider>
  );
};

export const UserData = () => useContext(myContext);
