const express = require('express'); // Bring in the express library.
const es6Renderer = require('express-es6-template-engine');
const app = express();              // Create new express app.
const http = require("http");
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3000;

// Import my model class
const Restaurant = require('./models/restaurants');
const User = require('./models/users');
const Favorite = require('./models/favorites');

app.engine('html', es6Renderer); // introduce html to es6Renderer
app.set('view engine', 'html'); // tell express to use as its view engine the thing that speaks html (es6Renderer)

app.set('views', 'views'); // tell express where to find the view files. (the second argument is the name of the directory where my template files will live)

// When they ask for the login page, send the login form
app.get('/login', (req, res) => {
    // send the login form
    // res.send('this is the login form');
    res.render('login-form');
});

app.get('/restaurants', async (req, res) => {
    const allRestaurants = await Restaurant.getAll();
    // const restaurantJSON = JSON.stringify(allRestaurants);
    // res.json will do two things
        // 1. It converts your JavaScript Object or Array to a JSON string
        // 2. It puts the correct Content-Type header on the response
    res.json(allRestaurants);
});
app.post('/restaurants', (req, res) => {
    res.send('{"message": "it sounds like you would like to create"}');
})
app.put('/restaurants', (req, res) => {
    res.send('{"message": "You wanna update, don\'t ya?"}');
});
app.put('/restaurants/:restID', (req, res) => {
    res.send(`You sent a PUT for ${req.params.restID}`)
});
app.delete('/restaurants', (req, res) => {
    res.send("You sent a DELETE");
});
app.delete('/restaurants/:restID', (req, res) => {
    res.send(`Restaurant ID: ${req.params.restID} has been deleted.`)
});

app.get('/users', async (req, res) => {
    const allUsers = await User.getAll();
    res.json(allUsers);
});
app.get('/users/:id', async (req, res) => {
    // how to grab a pice out of req.params (or any object);
    // const id = req.params.id;
    // This is known as "destructuring"
    const {id} = req.params;
    const theUser = await User.getById(id);
    res.json(theUser);
});
app.put('/users', (req, res) => {
    res.send('You put in a PUT request');
});
app.put('/users/:id', (req, res) => {
    res.send(`You have updated user ID: ${req.params.id}`)
});
app.post('/users', (req, res) => {
    res.send(`You sent a post to users`);
});
app.post('/users/:id', (req, res) => {
    res.send(`You posted user ID ${req.params.id}`)
});
app.delete('/users', (req, res) => {
    res.send('You want to delete all users?')
});
app.delete('/users/:id', (req, res) => {
    res.send(`You have deleted user ID ${req.params.id}`)
});

app.get('/users/:id/favorites', async (req, res) => {
    const userId = req.params.id;
    const favorites = await Favorite.getByUserId(userId);
    res.json(favorites);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});