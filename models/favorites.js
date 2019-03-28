// Bring in the database connection
const db = require('./conn');

class Favorite {
    constructor(id, user_id, restaurant_id) {
        this.id = id;
        this.userId = user_id;
        this.restaurantId = restaurant_id
    }


    static getByUserId(id) {
        return db.any(`
        select *
        from favorites
        where user_id=${id}
        `)
        .then((favoriteData) => {
            const favoritesArray = [];

            favoriteData.forEach((data) => {
                const favoriteInstance = new Favorite(data.user_id, data.restaurant_id
                    );
                favoritesArray.push(favoriteInstance);

            })
            return favoritesArray;
        })
    }
}

module.exports = Favorite;