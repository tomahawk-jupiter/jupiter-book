# NOTES

## Testing: What I Learned

`setupDB.js` is where the test setup functions are.

### Tests need a seperate app instance

To test your endpoints you need to **export/import your app without listening on it**. The tests need there own instance otherwise there will be an error. Do this by listening in a seperate file or listen conditionally based on if there is a TEST .env variable (if no TEST then listen) for when you want to start the app for dev/production.

### Tests need a seperate db connection

There also needs to be a seperate mongoose connection for tests, I think a seperate one for each test file is needed aswell as a seperate database for each test file.

Use the `beforeAll` and `afterAll` jest hooks to setup & cleanup the mongoose connection and database.

### Test db cleanup

Removing all collections from a mongoose database will also remove the database, so you don't need to use dropDatabase()

[Page top](#contents)
