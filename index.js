const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

// Import my model class
const Restaurant = require('./models/restaurants');
const User = require('./models/users');

const server = http.createServer(async (req, res) => {
    console.log(req)

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    // if req.url is "/restaurants", send them all restaurants
    // if req.url is "/users", send them all users
    // if it does not match either, send a welcome message

    if (req.url === "/restaurants") {
        const allRestaurants = await Restaurant.getAll();
        const restaurantJSON = JSON.stringify(allRestaurants);
        res.end(restaurantJSON);
    } else if (req.url.startsWith("/users")) {

        
        const parts = req.url.split("/");
        console.log(parts);
        // when the req.url is "/users", parts is [ '', 'users' ]
        // when the req.url is "/users/3" parts is [ '', 'users', '3' ]
        
        const method = req.method;
        if (method === "GET") {
            if (parts.length === 2) {
                const allUsers = await User.getAll();
                const userJSON = JSON.stringify(allUsers);
                res.end(userJSON);
            } else if (parts.length === 3) {
                // get user by id
                const userId = parts[2];
                const theUser = await User.getById(userId);
                const theUserJSON = JSON.stringify(theUser);
                res.end(theUserJSON);
            } else {
                res.statusCode = 404;
                res.end('Resource not found.');
            }
        } else if (method === "POST") {
            res.end('{ message: "it sounds like you would like to create"}');
        } else if (method === "PUT") {
            res.end('{You wanna update, don\'t ya?}')
        } else if (method === "DELETE") {
            res.end('{rm the user}')
        }



    
    } else {
        res.end(`{
            message: "Thank you for your patronage. Please send bitcoin."
        }`)
    }
});

server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});