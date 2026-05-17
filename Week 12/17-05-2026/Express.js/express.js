//Express Application with Multiple Routes and Middleware
const express = require('express');
const app = express();
const PORT = 3000;
//Middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
});
//Route for home page
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js application!');
});
//Route for about page
app.get('/about', (req, res) => {
    res.send('This is the about page of the Express.js application.');
});
//Route for user profile with dynamic parameter
app.get('/user/:username', (req, res) => {
    const username = req.params.username;
    res.send(`Hello, ${DanielWuese}! This is your profile page.`);
});
//Route for handling JSON data
app.post('/data', express.json(), (req, res) => {
    const receivedData = req.body;
    console.log('Received JSON data: ', receivedData);
    res.json({ message: 'Data received successfully!', data: receivedData });
});
//Route for handling query parameters
app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`You searched for: ${query}`);
});
//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});

//custom middleware for logging and request timing
app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request completed in ${endTime - startTime} ms`);
    });
    next();
}); 

//Route for handling form data
app.post('/submit', express.urlencoded({ extended: true }), (req, res) => {
    const formData = req.body;
    console.log('Received form data: ', formData);
    res.send('Form data received successfully!');
});

//Route for handling file uploads using multer
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    console.log('Received file: ', file);
    res.send('File uploaded successfully!');
});

//Route for handling errors
app.use((err, req, res, next) => {
    console.error('Error occurred: ', err);
    res.status(500).send('An error occurred while processing your request.');
});

//Route for handling 404 Not Found
app.use((req, res) => {
    res.status(404).send('Page not found.');
});

//implementing route-specific middleware for authentication and error handling
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader === 'Bearer mysecrettoken') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}
app.get('/protected', authenticate, (req, res) => {
    res.send('This is a protected route that requires authentication.');
});

//Error handling middleware for protected route
app.use('/protected', (err, req, res, next) => {
    console.error('Error in protected route: ', err);
    res.status(500).send('An error occurred in the protected route.');
});

//Route for handling file uploads with error handling
app.post('/uploadWithErrorHandling', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).send('No file uploaded.');
    } else {
        console.log('Received file: ', file);
        res.send('File uploaded successfully with error handling!');
    }
}, (err, req, res, next) => {
    console.error('Error during file upload: ', err);
    res.status(500).send('An error occurred during file upload.');
});


//Simple blog API with in-memory data storage
let posts = [];
app.post('/posts', express.json(), (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: posts.length + 1, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});
app.get('/posts', (req, res) => {
    res.json(posts);
});
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send('Post not found.');
    }   
});
app.put('/posts/:id', express.json(), (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        const { title, content } = req.body;
        post.title = title || post.title;
        post.content = content || post.content;
        res.json(post);
    } else {
        res.status(404).send('Post not found.');
    }
});
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        res.sendStatus(204);
    } else {
        res.status(404).send('Post not found.');
    }
});

//implementing CRUD operations with proper status codes and error handling
app.post('/items', express.json(), (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required.' });
    }
    const newItem = { id: posts.length + 1, name, description };
    posts.push(newItem);
    res.status(201).json(newItem);
});
app.get('/items', (req, res) => {
    res.json(posts);
}); 
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = posts.find(i => i.id === itemId);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found.' });
    }
});
app.put('/items/:id', express.json(), (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = posts.find(i => i.id === itemId);
    if (item) {
        const { name, description } = req.body;
        item.name = name || item.name;
        item.description = description || item.description;
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found.' });
    }
});
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = posts.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        posts.splice(itemIndex, 1);
        res.sendStatus(204);
    } else {
        res.status(404).json({ error: 'Item not found.' });
    }
}); 


//Basic Routing and Middleware in Express.js
app.get('/hello', (req, res) => {
    res.send('Hello, welcome to the Express.js routing example!');
});

app.get('/headers', (req, res) => {
    res.set({
         'Content-Type': 'text/plain',
            'X-Powered-By': 'Node.js',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.send('Headers have been set!');
});

app.use((req, res, next) => {
    console.log(`Request received at ${new Date().toISOString()}`);
    next();
});

app.get('/middleware', (req, res) => {
    res.send('This route demonstrates middleware in Express.js!');
}); 

app.post ('/json', express.json(), (req, res) => {
    const jsonData = req.body;
    console.log('Received JSON data: ', jsonData);
    res.json({ message: 'JSON data received successfully!', data: jsonData });
}
);

app.put('/update', express.json(), (req, res) => {
    const updateData = req.body;
    console.log('Received update data: ', updateData);
    res.json({ message: 'Update data received successfully!', data: updateData });
});

app.delete('/delete', (req, res) => {
    res.send('Delete request received successfully!');
});

app.all('/all', (req, res) => {
    res.send(`Received a ${req.method} request at /all route!`);
});


//app.js (main file)
const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes');
app.use('/', routes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});
