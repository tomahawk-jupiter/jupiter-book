# Social App API

This is a simple Facebook style app. Users can make and accept friend requests, make posts that include text and an image that friends can see, and comment and like posts.

I learnt was how to deal with image uploading. I settled on using **Cloudinary** to store images and store the links in mongoose. It was my first time using Cloudinary and its a great way to deal with image uploads. I couldn't find a better way to handle this.
I like that images can be resized while uploading to save space.

The user after logging in is stored in state rather than using backend authentication.

I used Express, Mongoose, Bcrypt, React, Cloudinary and axios.

## Running the api

There are some environmental variables that need to be setup before running this app.

### Running tests

This is my first real attempt at writing tests. It took me a while to get setup and working. I wrote the tests when I created the api but have not updated them since adding the frontend.

Create a .env variable `TEST=true` and npm test to run tests.

Also in .env put the mongo uri for tests, it needs to be split into two pieces, `MONGO_URI_L` and `MONGO_URI_R`. This is the connection string either side of the database name. Sample use:

    const connectionString = MONGO_URI_L + dbName + MONGO_URI_R;

This is so different test databases can be used in each test file.

### Starting the api

The api needs to be connected to mongoose.

Put mongoose connection string in a .env file eg. `MONGO_URI=connectionString`.

### Cloudinary

The cloudinary name, api key and api secret need to be available as an .env variable for the image uploads to work.

CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

## Production

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

This will create a node_modules though and it takes up alot of space. There is a way to clean this up. For now I just run the build myself before deploying.
