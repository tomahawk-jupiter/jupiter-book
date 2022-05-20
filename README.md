# Jupiter Book

A Facebook style app. I made this to learn and practice how to make and deploy a MERN app.

See the [live version](https://jupiter-book.herokuapp.com/) hosted on Heroku.

**This is the Production branch**

To run locally the base URL needs to be set in a couple of places to the local host. See the produciton section to see where this needs to be done.

## Contents

- [Fake Users](#fake-users)
- [What It Does](#what-it-does)
- [What I Used](#what-i-used)
- [Development Branch](#development-branch)
- [Image Upload](#image-upload)
- [User Login](#user-login)
- [Running the API](#running-the-api)
- [Production](#production)
- [Heroku Hosting](#heroku-hosing)

## Fake Users

There are two buttons for signing in with a sample user that already has a friend list.

Sign in info for the other fake users is name@name (lowercase) and password is 123456. Or first@last.

eg. james@james, 123456. Or jane@doe, 123456.

## What It Does

Users can:

- Login with a sample account to see it working
- Create an account and login
- Make and accept friend requests, look at pending requests
- Share posts that can include text and/or an images
- Comment and like posts

## What I Used

Express, Mongoose, React. Cloudinary for image storage.

## Development Branch

Use the development branch if you want to run this locally. The client and api are in seperate folders.

- Create and setup the .env file in the api directory [see below](#running-the-api)
- Install the dependencies with `$ npm install`, do this in the api and client directories
- Run`$ npm start` from within the api and the client

## Image Upload

I used Cloudinary for storing user uploaded images. The image links are stored in a mongoose database.

I limited the file size for uploads because this is just a practice app and large files would take a long time to upload for anyone playing around with it. This means large image files will have to be resized before uploading. To **allow larger files**, this needs to be set in the express middleware in `index.js` and in the `client/src/components/share/Share.jsx`.

I did setup Cloudinary to further resize the images before storing.

## User login

The user after logging in is stored in state using context-react rather than using backend authentication like Passport, this means a page refresh will logout the user. Passwords are encrypted with Bcrypt.

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

**NOTE**: The tests are incomplete.

I haven't written many tests before apart from when going through FreeCodeCamp and The Odin Project. It took me a while to get setup and working. I wrote the tests when I created the api to get some practice but have not updated them since adding the frontend and I've made changes to the api since then. But this is how to get them to run:

Create a .env variable `TEST=true` and then `$ npm test` to run tests. The test mongoose database needs to be setup first:

Also in .env put the mongo uri for tests, it needs to be split into two pieces, `MONGO_URI_L` and `MONGO_URI_R`. This is the connection string either side of the database name. Sample use:

    const connectionString = MONGO_URI_L + dbName + MONGO_URI_R;

This is so different test databases can be used in each test file.

## Production

I put the client directory in the api directory for deployment and the build folder is served by the backend.

The base URL for the api is setup in `client/src/axios.config.js`.

**potential problem**: There was a .env in the frontend that pointed to the assets folder, `<url>/assets`. This is no longer in the client on the main branch that is deployed but still seems to be working. I think this needs to be added before building the build folder but will get removed by the .gitignore when pushed.

### Helmet

I had to configure helmet.contentSecurityPolicy (api/index.js) because the images weren't being loaded. It is still blocking something but I can't figure out what.

### Node Version

I also added the following to the (api) package.json:

    "engines": {
      "node": "16.13.1"
    },

## Serving the client

The backend will serve the build folder using the express static folder middleware. This will be served on all routes not already handled by the api. This is in the top level `index.js`.

### Build script

I ran build before deploying. The following can be included (as a pack.json script) for heroku to build it:

    "build": "cd client && npm install && npm run build",

or

    "heroku-postbuild": "cd client && npm install && npm run build"

This will create a node_modules though and it takes up alot of space. There is a way to clean up the node_modules after the build but I'm not sure how to do this exacly yet. For now I just ran the build myself then delete the node_modules before I deployed it.

## Heroku Hosing

The environmental variables can be setup using the heroku cli or using the GUI.

Run locally using Heroku:

    $ heroku local web

### Initial Setup

    $ heroku login
    $ git init
    $ heroku git:remote -a <app-name>
    $ git add .
    $ git commit -am "my first commit"
    $ git push heroku master  // has to be master?

push branch other than main (don't include the <>):

    $ git push heroku <branchName>:main

### Remove repo from Heroku

You can remove a repo if you wan't to start again:

    $ heroku repo:reset -a <appname>

### Making Changes

    $ git add .
    $ git commit -m "my commit message"
    $ git push heroku master

## Improvements

- Use socket.io to make it work in real time
- Add a chat feature
- Use Passport for authentication to keep user logged in
- Add different colour schemes eg. dark mode
- Improve the styling
- Update the tests
