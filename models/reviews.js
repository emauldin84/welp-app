// Bring in the database connection
const db = require('./conn');

// declare the class
class Review {
    constructor(id, score, content, restaurant_id, user_id) {
        this.id = id;
        this.score = score;
        this.content = content;
        this.restaurantId = restaurant_id;
        this.userId = user_id
    }


    static getByRestaurantId(restId) {
        return db.any(`
        select * 
        from reviews
        where reviews.restaurant_id = ${restId};

        `)
        // create a new instance of Review
        .then(reviewData => {
            const reviewInstance = new Review(
                reviewData[0].id,
                reviewData[0].score,
                reviewData[0].content,
                reviewData[0].restaurant_id,
                reviewData[0].user_id
            );
            return reviewInstance
        })
    }
}

module.exports = Review;