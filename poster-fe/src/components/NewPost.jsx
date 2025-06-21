import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewPost(){
    const [formData, setFormData] = useState({title:'', body:''});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    {isLoading && <div className="loading-message">Processing...</div>}

    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        setFormData(data=>({...data,[name]:value}));
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try{
            const res = await fetch('/api/posts',{
                method:'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if(res.ok){
                navigate('/home');
            }else{
                const errorData = await res.json();
                setError(errorData.message || 'Something went wrong!')
            }
        }catch(err){
            setError(err.message);
        }finally{
            setIsLoading(false);
        }

    }

    return (
        <div className='new-post'>
            {isLoading && <div className="loading-message">Processing...</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input 
                    type='text' 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder='Title' 
                    disabled={isLoading} 
                    required
                />
                <textarea 
                    id="body" 
                    name="body" 
                    value={formData.body} 
                    onChange={handleInputChange} 
                    placeholder='Body' 
                    disabled={isLoading} 
                    required
                />
                <button type='submit' disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    )
}