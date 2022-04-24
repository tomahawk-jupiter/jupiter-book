# Social App

In the client side I use **React Router**, **React context**, and **MUI**. There are some notes and useful links in `NOTES.md` that helped me learn how to use these things.

## Context React

I use context react to store the current user after they have logged in instead of using passport tokens or sessions.

## Production

Fix the base URL in two places:

- .env (this is for the frontend assets)
- axios.config.js (this is for the api)

### .env

Change the .env `REACT_APP_PUBLIC_FOLDER=<appURL>/assets/`

### Proxy

The proxy in the package.json used for development won't work in production. Instead configure a baseURL for axios requests...

### axios baseURL

Create a config.js file in the frontend src folder and put in:

    import axios from ‘axios’;

    export const axiosInstance = axios.create({
        baseUrl: “<appURL>/api”
    })

Now import and use this where you use axios instead of importing axios directly. Eg:

    import { axiosInstance } from ‘../config.js’;
    await axiosInstance.get(“/posts”)

The axios requests will now use the configured baseURL.
