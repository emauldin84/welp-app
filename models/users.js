// Bring in the database connection
const db = require('./conn');

// Need a user class.
// Classes should start with an uppercase letter
class User {
    constructor(id, first_name, last_name, email, password) {
        this.id = id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.password = password;
    }

    // 'static' means that the function is something the class can
    // do, but an instance cannot.
    static getById(id) {
        // .any always returns an array
        // return db.any(`select * from users where id=${id}`);
        // Instead, we'll use .one to return only the particular object
        return db.one(`select * from users where id=${id}`)
            .then((userData) => {
                // you must use the 'new' keyword when you call a javascript constructor
                const userInstance = new User(userData.id, userData.first_name, userData.last_name, userData.email, userData.password);
                return userInstance;
            })
            .catch(() => {
                return null; // signal an invalid value
            })
    }

    // no static since this is an "instance method"
    // it belongs to the individual instance
    save() {
        // use .result when you might want a report about how many rows were affected
        return db.result(`
        update users set
            first_name='${this.firstName}',
            last_name='${this.lastName}',
            email='${this.email}',
            password='${this.password}'
        where id=${this.id}
        `)
    }
}

// User.getById(3)
//     .then((user) => {
//         console.log(user)
//     })

// Export User model
module.exports = User;