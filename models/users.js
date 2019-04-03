// Bring in the database connection
const db = require('./conn');
const Reviews = require('./reviews');
const Favorites = require('./favorites');
const bcrypt = require('bcryptjs');

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
    static getAll() {
        // .any returns 0 or more results in an array
        // but thats async so we `return` the call to db.any
        return db.any(`select * from users`);
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

    setPassword(newPassword) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        this.password = hash;
    };

    static getByEmail(email) {
        return db.one(`select * from users where email=$1`, [email])
            .then(userData => {
                const aUser = new User(
                    userData.id,
                    userData.first_name,
                    userData.last_name,
                    userData.email,
                    userData.password);
                return aUser;
            })
    }

    checkPassword(aPassword) {
        // const isCorrect = bcrypt.compareSync(aPassword, this.password);
        return bcrypt.compareSync(aPassword, this.password);
    }

    getReviews() {
        return db.any(`
        select *
        from reviews
        where user_id=${this.id}
        `)
        .then((arrayOfReviewData) => {
            // equivalent to using .map
            // console.log(arrayOfReviewData)
            const arrayOfReviewInstances = [];

            arrayOfReviewData.forEach((data) => {
                const newInstance = new Reviews(
                    data.id,
                    data.score,
                    data.content,
                    data.restaurant_id,
                    data.user_id
                );
                arrayOfReviewInstances.push(newInstance);
            });
            // console.log(arrayOfReviewInstances)
            return arrayOfReviewInstances;
        });
    }

    getFavorites() {
        return db.any(`
        select * 
        from favorites
        where user_id=${this.id}
        `)
        .then(userFavoritesData => {
            const userInstanceFavoritesData = [];

            userFavoritesData.forEach(favoritesData => {
                const newInstance =  new Favorites(
                    favoritesData.id,
                    favoritesData.user_id,
                    favoritesData.restaurant_id
                );
                userInstanceFavoritesData.push(newInstance)
            });
            return userInstanceFavoritesData;
        })
    }

    setFavorite(restId) {
        return db.result(`
        insert into favorites(user_id, restaurant_id)
        values
        (${this.id}, ${restId})
        `)
    }

    removeFavorite(restId) {
        return db.result(`
        delete from favorites
        where
        restaurant_id = ${restId}
        `)
    }
}

// User.getById(3)
//     .then((user) => {
//         console.log(user)
//     })

// Export User model
module.exports = User;