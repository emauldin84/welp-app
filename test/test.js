// const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const User = require('../models/users')
const Restaurant = require('../models/restaurants')
const Reviews = require('../models/reviews')

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
    it('should be able to return a resaurant by id', async () => {
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
});

describe ('Review model', () => {
    // Can I get one review?
    it('should be able to retrieve a review by ID', async () => {
        const theReview = await Reviews.getById(2);
        expect(theReview).to.be.an.instanceOf(Reviews);
    })
    // Can I get all reviews?
    // Can I get review by user?
});