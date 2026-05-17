// Creating HTTP Server
const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'X-Powered-By': 'Node.js',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Set-Cookie': 'sessionid=abc123; HttpOnly'
  });
  res.end('<h1>Hello, World!</h1>');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//creating a simple http server that responds to requests with JSON data
const jsonServer = http.createServer((req, res) => {
  if (req.url === '/api/data') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    const data = {
      message: 'Hello, this is JSON data!',
      console: 'Node.js HTTP Server'
    };
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  }
});

jsonServer.listen(PORT + 1, () => {
  console.log(`JSON Server is running on http://localhost:${PORT + 1}`);
});

//handling requests with appropriate headers and status codes
const headerServer = http.createServer((req, res) => {
  if (req.url === '/api/data') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    const data = {
      message: 'Hello, this is JSON data with headers!',
      console: 'Node.js HTTP Server'
    };
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  }
});

headerServer.listen(PORT + 2, () => {
  console.log(`Header Server is running on http://localhost:${PORT + 2}`);
});

//routing requests to different endpoints
const routingServer = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>Welcome to the Home Page!</h1>');
  } else if (req.url === '/about') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>About Us</h1><p>This is the about page.</p>');
  } else if (req.url === '/api/data') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    const data = {
      message: 'Hello, this is JSON data with headers!',
      console: 'Node.js HTTP Server'
    };
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  }
});

routingServer.listen(PORT + 3, () => {
  console.log(`Routing Server is running on http://localhost:${PORT + 3}`);
});

//handling different HTTP methods (GET, POST, PUT, DELETE)
const methodServer = http.createServer((req, res) => {
  if (req.url === '/api/data') {
    if (req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': 'sessionid=abc123; HttpOnly'
      });
      const data = {
        message: 'Hello, this is JSON data with headers!',
        console: 'Node.js HTTP Server'
      };
      res.end(JSON.stringify(data));
    } else {
      res.writeHead(405, {
        'Content-Type': 'text/html',
        'X-Powered-By': 'Node.js',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': 'sessionid=abc123; HttpOnly'
      });
      res.end('<h1>405 Method Not Allowed</h1>');
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  }
});

methodServer.listen(PORT + 4, () => {
  console.log(`Method Server is running on http://localhost:${PORT + 4}`);
});

//handling errors and sending appropriate responses
const errorServer = http.createServer((req, res) => {
  try {
    if (req.url === '/api/data') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': 'sessionid=abc123; HttpOnly'
      });
      const data = {
        message: 'Hello, this is JSON data with headers!',
        console: 'Node.js HTTP Server'
      };
      res.end(JSON.stringify(data));
    }
  } catch (error) {
    res.writeHead(500, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>500 Internal Server Error</h1><p>' + error.message + '</p>');
  }
});

errorServer.listen(PORT + 5, () => {
  console.log(`Error Server is running on http://localhost:${PORT + 5}`);
});


//handling route parameters and query strings
const routeServer = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/data') {
    const name = url.searchParams.get('name') || 'Guest';
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    const data = {
      message: `Hello, ${name}! This is JSON data with headers!`,
      console: 'Node.js HTTP Server'
    };
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  }
}
);
routeServer.listen(PORT + 6, () => {
  console.log(`Route Server is running on http://localhost:${PORT + 6}`);
});


//Parsing request body data for POST and PUT requests
const bodyServer = http.createServer((req, res) => {
  if (req.url === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': 'sessionid=abc123; HttpOnly'
      });
      const data = {
        message: 'Data received successfully!',
        receivedData: JSON.parse(body)
      };
      res.end(JSON.stringify(data));
    });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  } });
bodyServer.listen(PORT + 7, () => {
  console.log(`Body Server is running on http://localhost:${PORT + 7}`);
});

//validating incoming request data and sending appropriate responses
const validationServer = http.createServer((req, res) => {
  if (req.url === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.name) {
          throw new Error('Name is required');
        }
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'X-Powered-By': 'Node.js',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Set-Cookie': 'sessionid=abc123; HttpOnly'
        });
        const responseData = {
          message: 'Data received successfully!',
          receivedData: data
        };
        res.end(JSON.stringify(responseData));
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json', 
          'X-Powered-By': 'Node.js',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Set-Cookie': 'sessionid=abc123; HttpOnly'
        });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-Powered-By': 'Node.js',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Set-Cookie': 'sessionid=abc123; HttpOnly'
    });
    res.end('<h1>404 Not Found</h1>');
  }
});
validationServer.listen(PORT + 8, () => {
  console.log(`Validation Server is running on http://localhost:${PORT + 8}`);
}); 


      
