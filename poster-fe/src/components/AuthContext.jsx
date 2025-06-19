import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
}