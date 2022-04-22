# Social App API

While making the backend for this project I learnt some useful things.

The first was writing tests. Getting a test database setup and cleaning it up afterwards. I used **Jest** and **Supertest**.

The second big thing I learnt was how to deal with image uploading. I settled on using **Cloudinary** to store images and store the links in mongoose. It was my first time using Cloudinary and its a great way to deal with image uploads. I couldn't find a better way to handle this.
I like that images can be resized while uploading to save space.

## Running the api

There are some environmental variables that need to be setup before running this app.

### Running tests

This is my first real attempt at writing rest api tests. It took me a while to get setup and working.

Create a .env variable `TEST=true` and npm test to run tests.

Also in .env put the mongo uri for tests, it needs to be split into two pieces, `MONGO_URI_L` and `MONGO_URI_R`. This is the connection string either side of the database name. Sample use:

    const connectionString = MONGO_URI_L + dbName + MONGO_URI_R;

This is so different test databases can be used.

### Starting the api

The api needs to be connected to mongoose.

Put mongoose connection string in a .env file eg. `MONGO_URI=connectionString`.

### Cloudinary

The cloudinary name, api key and api secret need to be available as an .env variable for the image uploads to work.

CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
