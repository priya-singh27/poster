import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        const token = document.cookie
        .split('; ')
        .find(ck => ck.startsWith('token='))
        ?.split('=')[1];

        if(token) setIsLoggedIn(true);
    }, []);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>{children}</AuthContext.Provider>
    )

}