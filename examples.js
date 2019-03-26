const db = require('./conn');

async function getUserById(theId) {
    return await db.any(`SELECT * from users where id = ${theId}`)
}
// getUserById(1).then(console.log)

async function main() {
    const user3 = await getUserById(3);
    console.log(user3);
}
main();

// function getRestNameReviewsFavs() {
//     return db.any("select rests.name, rests.address, SUM(revs.score) / COUNT(revs.score) as average_score, COUNT(distinct revs.score) as total_reviews, COUNT(distinct favs.id) as total_favorites from reviews revs INNER JOIN restaurants rests ON rests.id = revs.restaurant_id INNER JOIN favorites favs ON rests.id = favs.restaurant_id GROUP BY rests.name, rests.address;")

// }
// getRestNameReviewsFavs().then(console.log)


// function getReviewForRestaurant(restID) {
//     return db.any(`select count(*) as number_of_reviews, rests.name, revs.restaurant_id 
//         from restaurants rests 
//         INNER JOIN reviews revs 
//         ON revs.restaurant_id = rests.id 
//         WHERE rests.id = ${restID} 
//         GROUP BY rests.name, revs.restaurant_id;`)
// }

// getReviewForRestaurant(1).then(function(response){
//     const restaurant = response[0].name
//     console.log(restaurant)
// })