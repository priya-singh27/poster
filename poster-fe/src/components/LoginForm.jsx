import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthContext";
import '../styles/LoginForm.css'

export default function Login() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (res.ok) {
                setIsLoggedIn(true);
                navigate('/home');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
           <h2 className="heading">Login</h2>
            <form onSubmit={handleSubmit}>
                <h2>Welcome Back!</h2>

                {error && <div className="error-message">{error}</div>}
                {isLoading && <div className="loading-message">Processing your login...</div>}
                
                <div className="input-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        disabled={isLoading}
                        required
                    />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        required
                    />
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>


            </form>
        </div>
    );
}