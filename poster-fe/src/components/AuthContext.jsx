import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const checkAuthStatus = async () => {
            
            try{
                const token = document.cookie
                .split('; ')
                .find(ck => ck.startsWith('token='))
                ?.split('=')[1];
    
                if(token) setIsLoggedIn(true);
            
                const res = await fetch('/api/user');
                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
            } catch (err) {
                setIsLoggedIn(false);
                console.error('Auth check failed:', err);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const logout = async ()=>{
        try{
            await fetch('/api/logout', {method:'DELETE'});
        }catch(err){
            console.error('Logout error:', err);
        }
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, isLoading, logout}}>{children}</AuthContext.Provider>
    )

}