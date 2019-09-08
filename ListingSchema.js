/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/* Create your schema for the data in the listings.json file that will define how data is saved in your database
     See https://mongoosejs.com/docs/guide.html for examples for creating schemas
     See also https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
  */
var listingSchema = new Schema({
  /* Your code for a schema here */
  //Check out - https://mongoosejs.com/docs/guide.html
  code: String,
  name: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  address: String,
});

/* Create a 'pre' function that adds the updated_at (and created_at if not already there) property 
   See https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
*/
listingSchema.pre('save', function(next) {
  // Sanity check to make sure name and code are provided
  if (this.name == undefined) throw '[DB]: name not provided';
  if (this.code == undefined) throw '[DB]: code not provided';

  // Get date object
  var currDate = new Date();
  // Update the updated_at property
  this.updated_at = currDate;
  // If created_at is not present then create it
  if (!this.created_at) this.created_at = currDate;
  // Pass onto next middleware
  next();
});

/* Use your schema to instantiate a Mongoose model */
//Check out - https://mongoosejs.com/docs/guide.html#models
var Listing = mongoose.model('Listing', listingSchema);

/* Export the model to make it available to other parts of your Node application */
module.exports = Listing;
