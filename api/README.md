# Social App API

## Running tests

Create a .env variable `TEST=true` and npm test to run tests.

Also in .env put the mongo uri for tests, it needs to be split into two pieces, `MONGO_URI_L` and `MONGO_URI_R`. This is the connection string either side of the database name. Sample use:

    const connectionString = MONGO_URI_L + dbName + MONGO_URI_R;

## Starting the api

The api needs to be connected to mongoose.

Put mongoose connection string in a .env file eg. `MONGO_URI=connectionString`.
