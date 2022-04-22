# Social Media Style App

I learnt alot making this project. Its the first time I've made a seperate frontend and backend. There are a few notes and links to useful articles in the seperate folders in NOTES.md and the api folder has a README that explains about what .env variables are needed for it to work.

I created a rest api for the backend that deals with storing user data in a mongoose database. It uses Cloudinary to deal with image uploads.

I had a go at writing some tests for it using Jest and Supertest. I also used Postman to help while creating the api.

The frontend uses React, React Router, and MUI.

I use React Context to store the current user rather than using Passport Tokens or sessions. This means a page refresh will logout the user.

I also attempted to make it responsive for different screen sizes.
