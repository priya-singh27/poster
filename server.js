const Butter = require('./butter');

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

//******* Files Routes *******//
server.route("get", '/', (req,res)=>{
    res.sendFile('./public/index.html', 'text/html');
});

server.route('get', '/styles.css', (req,res)=>{
    res.sendFile('./public/styles.css', 'text/css');
});

server.route('get', '/script.js', (req,res)=>{
    res.sendFile('./public/script.js', 'text/javascript');
});

server.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
});


//******* JSON Routes *******//
server.route('get', '/api/posts', (req,res)=>{

    //now each object in POSTS have a property author. 
    POSTS.map(post =>{
        const user = USERS.find(user => user.id === post.userId);
        post.author= user.name;
        return post;
    });
    res.status(200).json(POSTS); 
});

// server.route('post', '/api/login', ())
