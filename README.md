# Social Media Style App

A Facebook style app.

I learnt alot making this project. Its the first time I've made a react frontend with a backend. There are a few notes and links to useful articles in the seperate folders in NOTES.md and the api folder has a README that explains about what .env variables are needed for it to work.

## Backend

Uses Express, Mongoose, Cloudinary.

I created a rest api for the backend that deals with storing user data in a mongoose database. It uses Cloudinary to deal with image uploads.

I had a go at writing some tests for the api using Jest and Supertest. I also used Postman to help while creating the api. I haven't updated the tests yet since first making the api and I've made changes to it since then.

There are more notes in the api README.md and NOTES.md

## Frontend

The frontend uses React, React Router, and MUI.

I use React Context to store the current user in state rather than using Passport Tokens or sessions like I've used in previous projects. This means a page refresh will logout the user.

I added some responsive style / layout. I wrote a custom react hook that looks for the screen size so I can render React components conditionally. On a wider screen friend / suggested friends will be shown in side panels. On narrow screen they will be in the menu.

There are more notes in the client folder README, they are mostly for myself to remind me of things I learnt.
