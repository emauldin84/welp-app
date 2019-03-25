const db = require('./conn');

db.any('SELECT * FROM users;')
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        // error;
    });