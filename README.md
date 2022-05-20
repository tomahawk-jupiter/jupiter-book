# Jupiter Book

A Facebook style app. I made this to learn and practice how to make and deploy a MERN app.

See the [live version](https://jupiter-book.herokuapp.com/) hosted on Heroku.

## Fake Users

Sign in info for the fake users is name@name (lowercase) and password is 123456. Or first@last.

eg. james@james, 123456. Or jane@doe, 123456.

## What It Does

Users can:
- Create an account and login
- Login with a sample account to see it working
- Make and accept friend requests
- Share posts that can include text and/or an image that friends can see
- Comment and like posts

## What I Used

Express, Mongoose, Bcrypt, Cloudinary, Jest, Supertest, React, MUI, axios.

## Development Branch

Use the development branch if you want to run this locally. The client and api are in seperate folders. 

- Create and setup the .env file in the api directory [see below](#running-the-api)
- Install the dependencies with `$ npm install`, do this in the api and client directories
- Run`$ npm start` from within the api and the client

## Image Upload

I used Cloudinary for storing user uploaded images. The image links are stored in a mongoose database.

I limited the file size for uploads because this is just a practice app and large files would take a long time to upload for anyone playing around with it. This means large image files will have to be resized before uploading. This can be changed easily enough in the code.

I did setup Cloudinary to further resize the images before storing.

## User login

The user after logging in is stored in state rather than using backend authentication like Passport, this means a page refresh will logout the user. Passwords are encrypted with Bcrypt.

## Running the api

There are some environmental variables that need to be setup before running this app.

### Starting the api

The api needs to be connected to mongoose.

Put mongoose connection string in a .env file eg. `MONGO_URI=connectionString`.

### Cloudinary

The cloudinary name, api key and api secret need to be available as an .env variable for the image uploads to work. You can create a free Cloudinary account.

CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

### Running tests

I haven't written many tests before apart from when going through FreeCodeCamp and The Odin Project. It took me a while to get setup and working. I wrote the tests when I created the api to get some practice but have not updated them since adding the frontend and I've made changes to the api since then. But this is how to get them to run:

Create a .env variable `TEST=true` and npm test to run tests.

Also in .env put the mongo uri for tests, it needs to be split into two pieces, `MONGO_URI_L` and `MONGO_URI_R`. This is the connection string either side of the database name. Sample use:

    const connectionString = MONGO_URI_L + dbName + MONGO_URI_R;

This is so different test databases can be used in each test file.

## Production

I put the client directory in the api directory for deployment.

I had to configure helmet.contentSecurityPolicy (api/index.js) because the images weren't being loaded. It is still blocking something but I can't figure out what.

I also added the following to the (api) package.json:

    "engines": {
      "node": "16.13.1"
    },

### Build script

I ran build before deploying. The following can be included (as a pack.json script) for heroku to build it:

    "build": "cd client && npm install && npm run build",

or

    "heroku-postbuild": "cd client && npm install && npm run build"

This will create a node_modules though and it takes up alot of space. There is a way to clean up the node_modules after the build but I'm not sure how to do this exacly yet. For now I just ran the build myself then delete the node_modules before I deployed it.

## Improvements

- Use socket.io to make it work in real time
- Add a chat feature
- Use Passport for authentication to keep user logged in
- Add different colour schemes eg. dark mode
- Improve the styling
- Update the tests
