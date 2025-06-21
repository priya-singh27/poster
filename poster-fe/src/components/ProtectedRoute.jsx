import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({children}){
    const {isLoggedIn, isLoading} = useContext(AuthContext);

    if(isLoading){
        return (
            <div>
                <div className="loading-message">Checking authentication...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}