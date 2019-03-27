// Bring in the database connection
const db = require('./conn');

// declare the class
class Restaurant {
    constructor(id, name, address, street, state, phone, menu, picture) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.street = street;
        this.state = state;
        this.phone = phone;
        this.menu = menu;
        this.picture = picture
    }

    static getAll() {
        // .any returns 0 or more results in an array
        // but thats async so we `return` the call to db.any
        return db.any(`select * from restaurants`);
    }

    static getById(id) {
        return db.one(`
        select * from restaurants
        where id=${id}
        `)
        .then((restaurantData) => {
            const restaurantInstance = new Restaurant(restaurantData.id, restaurantData.name, restaurantData.address, restaurantData.street, restaurantData.state, restaurantData.phone, restaurantData.menu, restaurantData.picture);
            // console.log(restaurantInstance);
            return restaurantInstance;
        })
    }

    static getByName(name) {
        return db.one(`
        select * from restaurants
        where name ilike '${name}'
        `)
        .then((restaurantData) => {
            const restaurantInstance = new Restaurant(restaurantData.id, restaurantData.name, restaurantData.address, restaurantData.street, restaurantData.state, restaurantData.phone, restaurantData.menu, restaurantData.picture);
            // console.log(restaurantInstance);
            return restaurantInstance;
        })
    }

    getReviewCount() {
        return db.one(`
        select COUNT(revs.id)
        from reviews revs
        inner join restaurants rests
        on rests.id = revs.restaurant_id
        where rests.id = ${this.id};
        `)
    }

}

// export the class
module.exports = Restaurant;