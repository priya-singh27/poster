import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

export default function Profile(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        setFormData((data)=>({...data,[name]:value}));
    }

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try{
                const res = await fetch('/api/user',{
                    method:'GET',
                });

                if(res.ok){
                    const userData = await res.json();
                    
                    setFormData((data) =>({
                        ...data,
                        name: userData.name,
                        username: userData.username ,
                    }));
                }else{
                    const errorData = await res.json();
                    setError(errorData.message || 'Something went wrong!')
                }
            }catch(err){
                setError(err.message);
            }finally{
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async ()=>{
        setIsLoading(true);
        try{
            const res = await fetch('/api/user',{
                method:'PUT',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if(res.ok){
                navigate('/');
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
        <div className='profile-page'>
            {isLoading && <div className="loading-message">Processing...</div>}
            {error && <div className="error-message">{error}</div>}
            <div className='form-element'>
                <label className="input-label">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-box"
                    placeholder="Enter name"
                />
            </div>
            <div className='form-element'>
                <label className="input-label">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input-box"
                    placeholder="Enter username"
                />
            </div>
            <div className='form-element'>
                <label className="input-label">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-box"
                    placeholder="Enter password"
                />
            </div>
            <div className='form-element'>
                <button onClick={handleSubmit} className="save-btn">Save</button>
            </div>
        </div>
    )

}