// const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const User = require('../models/users')
const Restaurant = require('../models/restaurants')
const Reviews = require('../models/reviews')
const Favorite = require('../models/favorites')

// describe('Sanity check', function () {
//     it('should be 2', function() {
//         // assert.equal(2, 1 + 1);
//         expect(1 + 1).to.equal(2);
//     });
// });

// adds section for restaurant tests
describe('Restaurant model', () => {
    it('should be able to grab an array of restaurants', async () => {
        // write the code you wish existed
        const arrayOfRestaurants = await Restaurant.getAll();
        expect(arrayOfRestaurants).to.be.instanceOf(Array);
    });
    it('should be able to return a restaurant by id', async () => {
        const theRestaurant = await Restaurant.getById(3);
        expect(theRestaurant).to.be.instanceOf(Restaurant);
    })

    it('should be able to return a restaurant by name', async () => {
        const theRestaurant = await Restaurant.getByName('Ammazza');
        expect(theRestaurant).to.be.instanceOf(Restaurant);
    })

});

// adds section for review tests
describe('Review model', () => {
    it('should show reviews per specific restaurant id', async () => {
        const theReviews = await Reviews.getByRestaurantId(3);
        console.log(theReviews);
        expect(theReviews).to.be.instanceOf(Reviews);
    })
})

// adds section for user tests
describe ('User model', () => {
    // happy path
    it('should be able to retrieve by id', async () => {
        const theUser = await User.getById(3);
        theUser.should.be.an.instanceOf(User);
        // theUser.should.have.length(1);
    });
    // unhappy path
    it('should error if no user by id', async () => {
        const theUser = await User.getById(89);
        expect(theUser).to.be.null;
        // theUser.should.be.an.instanceOf(User);
        // theUser.should.have.length(1);
    });

    it('should update the user', async () => {
        // grab a user with id 2
        const theUser = await User.getById(2);
        // update the email
        theUser.email = "new@new.com";
        // save the user
        await theUser.save();
        const alsoTheUser = await User.getById(2);
        expect(alsoTheUser.email).to.equal('new@new.com');
        // theUser.save()
        //     .then(async (report) => {
        //         // console.log(report);
        //         // re-grab the user with id 2
        //         const alsoTheUser = await User.getById(2);
        //         // expect the email to be equal to the new value
        //         expect(alsoTheUser.email).to.equal('new@new.com');
        //     });
    });

    it('should not have the same email after updating it', async () => {
        // grab a user with id 2
        const theUser = await User.getById(2);
        // grab the current value for the email field
        const theOldEmail = theUser.email;
        await console.log(theOldEmail);

        // update the email to a new value
        // using the Unix timestamp as part of the address
        const theNewEmail = `new${new Date().getTime()}@email.com`;
        theUser.email = theNewEmail;

        // save the user to the database
        await theUser.save();

        // re-grab the user with ID 2
        const alsoTheUser = await User.getById(2);
        console.log (alsoTheUser.email);

        // expect the email not be equal to the new value;
        expect(theUser.email).to.not.equal(theOldEmail);
        expect(theUser.email).to.equal(theNewEmail);
    })

    it('should encrypt the password', async () => {
        // get user with id 1
        const theUser = await User.getById(1);
        // set their password field to "bacon"
        theUser.setPassword("bacon");
        // compare their password to "bacon"
        expect(theUser.password).not.to.equal("bacon");
        // it should be false

    })

    it('should be able to check for correct passwords', async () => {
        // get user with id 1
        const theUser = await User.getById(1);
        // set their password field to "bacon"
        theUser.setPassword("bacon");
        // save them to the database
        await theUser.save();
        // get them back out of the database
        sameUser = await User.getById(1);
        // ask them if their password is "bacon"
        const isCorrectPassword = sameUser.checkPassword("bacon");
        expect(isCorrectPassword).to.be.true;

        const isNotCorrectPassword = sameUser.checkPassword("tofu");
        expect(isNotCorrectPassword).to.be.false;
    })
});

describe ('Review model', () => {
    // Can I get one review?
    it('should be able to retrieve a review by ID', async () => {
        const theReview = await Reviews.getById(2);
        expect(theReview).to.be.an.instanceOf(Reviews);
    })
    // Can I get all reviews?
    it('should be able to retrieve all reviews', async () => {
        const allTheReviews = await Reviews.getAll();
        expect(allTheReviews).to.be.an.instanceOf(Array);
        // and make sure each of them is an array
        // use a plain for loop, so that the exception does not
        // get swallowed by a .forEach callback.
        for (let i=0; i<allTheReviews.length; i++) {
            expect(allTheReviews[i]).to.be.an.instanceOf(Reviews);
        }
    });
});

describe('Users and Reviews', () => {
    // Can I get review by user?
    it('A user instance should be able to retrieve all their reviews', async() => {
        // grab a user by id 5
        const theUser = await User.getById(5);
        // then get all their reviews
        const theReviews = await theUser.getReviews();
        // console.log(theReviews.length)
        // const numOfReviews = await theReviews.length
        // confirm that their reviews are in an array
        expect(theReviews).to.be.an.instanceOf(Array);
        // and that the array is the correct length, which should be 2
        expect(theReviews).to.have.lengthOf(2);
        // and that each one is an instance of reviews
        for (let i=0; i<theReviews.length; i++) {
            expect(theReviews[i]).to.be.an.instanceOf(Reviews)
        }
    })

})

describe('Favorite model', async () => {
    // get all favorites by user
    it('should be able to retrieve favorites by user id', async () => {
        const userFavorite = await Favorite.getByUserId(3);
        expect(userFavorite).to.be.an.instanceOf(Array);
        // console.log(userFavorite)

        userFavorite.forEach(favorite => {
            expect(favorite).to.be.instanceOf(Favorite);
        })
    }) 

})

describe('Users and Favorites model', async () => {
    it('should allow user to get all their favorites given their id', async () => {
        const theUser = await User.getById(3);
        //use instance of user to get their favorites
        const userFavorites = await theUser.getFavorites();
        expect(userFavorites).to.be.instanceOf(Array);

        userFavorites.forEach(favorite => {
            expect(favorite).to.be.instanceOf(Favorite);
        })
    })

    it('should allow a user to set a particular restaurant as a favorite', async () => {
        const theUser = await User.getById(4);
        // instance of user should be able to create a new favorite rest base on rest id
        const userFavorites = await theUser.getFavorites();
        const currentNumberOfFavorites = userFavorites.length;
        await theUser.setFavorite(4);

        const updatedUserFavorites = await theUser.getFavorites();
        // check if number of favorites is different from old number of favorites
        expect(updatedUserFavorites.length).not.to.equal(currentNumberOfFavorites);

    })

    // it('should allow a user to unset a particular restaurant as a favorite', async () => {
    //     const theUser = await User.getById(3);
    //     const userFavorites = await theUser.getFavorites();
    //     // console.log(userFavorites)
    //     const currentNumberOfFavorites = userFavorites.length;
    //     await theUser.removeFavorite(5);

    //     const updatedUserFavorites = await theUser.getFavorites();
    //     // check is number of favorites is different from old number of favorites
    //     expect(updatedUserFavorites.length).not.to.equal(currentNumberOfFavorites);
    // })
})