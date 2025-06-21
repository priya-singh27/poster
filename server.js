const Butter = require('./butter');

const SESSIONS = []

const USERS = [
    {id:1, name:"Priya Singh", username:'priya27', password:'string'},
    {id:2, name:"Krishna", username:'krishna', password:'string'},
    {id:3, name:"Hari", username:'Hari', password:'string'}
];

const POSTS = [
    {
        id:1,
        title: "First Post 👀",
        body:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        userId:1,
    },
    {
        id:2,
        title: "Second Post 👀",
        body:"The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        userId:1
    },
    {
        id:3,
        title: "Third Post 👀",
        body:"Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
        userId:2
    },
];

const PORT=8000

const server = new Butter();

//For authentication
server.beforeEach((req,res, next)=>{

    const routeToAuthenticate = [
        "GET /api/user",
        "PUT /api/user",
        "POST /api/posts",
        "DELETE /api/logout"
    ]

    if(routeToAuthenticate.indexOf(req.method+" "+req.url) !== -1){

        if(req.headers.cookie){
            const cookies = req.headers.cookie.split("; ");
            let token;
            for(let cookie of cookies){
                const [key, value] = cookie.split("=");
                if(key === "token"){
                    token = value;
                }
            }

            console.log(`Token = ${token}`)
            console.log(`Current SESSIONS:`, SESSIONS) // ADD THIS LINE
            console.log(`Number of sessions:`, SESSIONS.length) 
        
            const session  = SESSIONS.find((session) => session.token === token);
    
            if(session){
                req.userId = session.userId;
                console.log("Got token successfully..")
                return next();
            }else{
                console.log('No session found')
                console.log('Available tokens:', SESSIONS.map(s => s.token)) 
            }
        }else{
            console.log('cookie not found')
        }

        return res.status(401).json({error:"Unauthorized"})
    }else{
        next();
    }

});

//For parsing JSON body
server.beforeEach((req,res, next)=>{
    if(req.headers["content-type"] === "application/json"){
        let body = ""
        req.on('data', (chunk)=>{
            body+=chunk.toString('utf-8');
        });

        req.on('end', ()=>{
            body= JSON.parse(body);//js object from js string
            req.body =body
            return next();
        });
    }else{
        next();
    }
});

//For different routes that need the index.html file,
server.beforeEach((req,res, next)=>{
    const routes = [
        '/',
        '/login',
        '/profile',
        '/new-post'
    ]
    if(routes.indexOf(req.url) !== -1 && req.method === 'GET'){
        return res.status(200).sendFile('./public/index.html', 'text/html');
    }else{
        next();
    }
})

//----------- Files Routes -----------//
server.route('get', '/styles.css', (req,res)=>{
    res.sendFile('./public/styles.css', 'text/css');
});

server.route('get', '/script.js', (req,res)=>{
    res.sendFile('./public/script.js', 'text/javascript');
});

//----------- JSON Routes -----------//
server.route('get', '/api/posts', (req,res)=>{

    //now each object in POSTS have a property author. 
    POSTS.map(post =>{
        const user = USERS.find(user => user.id === post.userId);
        post.author= user.name;
        return post;
    });
    res.status(200).json(POSTS); 
});

server.route('post', '/api/login', (req,res)=>{
        
    const username = req.body.username;
    const password = req.body.password;

    const user = USERS.find((user) => user.username === username);
    if(user && user.password === password){
        const token = Math.floor( Math.random()*1000000000).toString();

        //save the generated token in db(not exactly)
        SESSIONS.push({userId: user.id, token:token});
        console.log('Added session!')

        res.setHeader("Set-Cookie", `token=${token}; Path=/;`)//path ='/' means we want to send token in all the following requests
        res.status(200).json({message: "Logged in successfully!"});
    }else{
        res.status(401).json({message: "Invalid username or password"});
    }
   
});

//send user profile info
server.route('get', '/api/user', (req,res)=>{
    const user = USERS.find((user)=> user.id === req.userId);
    res.status(200).json({username: user.username, name: user.name});
    
});

server.route('put', '/api/user', (req,res)=>{
    const userName = req.body.username;
    const name = req.body.name;
    const password = req.body.password;

    const user = USERS.find((user)=> user.id === req.userId);

    user.username = userName;
    user.name = name;

    //optionally update password
    if(password) user.password = password;

    res.status(200).json({
        username: userName,
        name: name,
        password_status: password?"updated":"not updated",
    });
});

server.route("delete", '/api/logout', (req,res)=>{
    //Remove the session object from SESSIONS array
    const sessionIdx = SESSIONS.find(session=>session.userId === req.userId);
    if(sessionIdx>-1){
        SESSIONS.splice(sessionIdx, 1)
    }

    res.setHeader("Set-Cookie", `token=deleted; Path=/; Expires=Sun, 15 June 2025 00:00:00 GMT`)

    res.status(200).json({
        message:"Logged out successfully"
    });
})

server.route('post', '/api/posts', (req,res)=>{
    const title = req.body.title;
    const body = req.body.body;

    const post = {
        id: POSTS.length+1,
        title: title,
        body: body,
        userId : req.userId,
    }

    // POSTS.push(post);//adds at the end of the array
    POSTS.unshift(post);//adds post at the start of the array
    res.status(201).json(post);
});

//-------------------------------------

server.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
});
