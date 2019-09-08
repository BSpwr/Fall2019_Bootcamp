'use strict';
/* 
  Import modules/files you may need to correctly run the script. 
  Make sure to save your DB's uri in the config file, then import it with a require statement!
 */
var fs = require('fs'),
  util = require('util'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Listing = require('./ListingSchema.js'),
  config = require('./config');

/* Connect to your database using mongoose - remember to keep your key secret*/
//see https://mongoosejs.com/docs/connections.html
//See https://docs.atlas.mongodb.com/driver-connection/
mongoose.connect(config.db.uri, { useNewUrlParser: true });

/*
  Instantiate a mongoose model for each listing object in the JSON file, 
  and then save it to your Mongo database 
  //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

  Remember that we needed to read in a file like we did in Bootcamp Assignment #1.
 */

const asyncFileRead = util.promisify(fs.readFile);

async function dbPopulate() {
  // PURGE ALL PREVIOUS LISTINGS FIRST
  Listing.deleteMany({}, () => {});

  // Begin repopulating DB
  let parsedJson = undefined;
  try {
    let readFile = await asyncFileRead('listings.json', 'utf8');
    parsedJson = JSON.parse(readFile);
  } catch (err) {
    let errStr = `[JSON Read/Parse]: ${err}`;
    console.log(errStr);
    throw errStr;
  }
  if (parsedJson['entries'] == undefined) {
    let errStr = `[JSON Read/Parse]: unexpected input`;
    console.log(errStr);
    throw errStr;
  }
  let arrEntries = parsedJson['entries'];
  for (let x in arrEntries) {
    let docListing = new Listing();
    docListing.code = arrEntries[x].code;
    docListing.name = arrEntries[x].name;
    docListing.coordinates = arrEntries[x].coordinates;
    docListing.address = arrEntries[x].address;
    async function asyncSave(doc) {
      return doc.save();
    }
    let saveDoc = undefined;
    try {
      saveDoc = await asyncSave(docListing);
    } catch (err) {
      let errStr = `[DB]: ${err}`;
      console.log(errStr);
      throw errStr;
    }
    if (saveDoc != undefined)
      console.log(`[DB]: Successfully Saved: ${saveDoc}`);
  }
  return mongoose.disconnect();
}

dbPopulate();

/*  
  Check to see if it works: Once you've written + run the script, check out your MongoLab database to ensure that 
  it saved everything correctly. 
 */
