import '../styles/Home.css'
import {useNavigate} from 'react-router-dom'
import NewPost from './NewPost';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function Topbar(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const {logout, isLoggedIn} = useContext(AuthContext);

    {isLoading && <div className="loading-message">Processing...</div>}

    const handleCreatePost = ()=>{
        navigate('/new-post');
    }

    const handleAuth = async()=>{
        if (isLoggedIn) {
            setIsLoading(true);
            try{
                await logout();
                navigate('/');
            }catch(err){
                setError(err.message);
            }finally{
                setIsLoading(false);
            }
        } else {
            navigate('/login');
        }
    }

    const handleProfileClick = async()=>{
        navigate('/profile')
    }

    return(
        <div className="nav-bar">
            <div className="left-part">Home</div>
            <div className="right-part">
                <button className="create-post" onClick={handleCreatePost}>Create a Post</button>
                <div className='nav-func' onClick={handleProfileClick}>Profile</div>
                <div className='nav-func' onClick={handleAuth}>{isLoggedIn ? "Logout" : "Login"}</div>
            </div>
            {isLoading && <div className="loading-message">Processing...</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    ) 
}

export default function Home(){
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/posts', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchPosts();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    return(

        <div className='home-page'>
            <Topbar />
            {!isLoading && !error && posts.length === 0 && (
                <div>
                    No posts yet. Create the first one!
                </div>
            )}
           <div className="posts-container">
                {posts.map(post => (
                    <div key={post.id} className="post">
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                        <p className="author">By {post.author}</p>
                    </div>
                ))}
            </div>
            {isLoading && <div className="loading-message">Processing...</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}