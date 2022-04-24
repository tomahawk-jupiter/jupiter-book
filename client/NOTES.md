# Notes - things I learnt

## Contents

- [Packages](#packages)
- [Proxy setup (base url)](#proxy)
- [React Context and hooks](#react-context-with-usecontext-and-usereducer)
- [useReducer](#usereducer)
- [Axios delete with body](#axios-delete-with-body)
- [Active Nav Link Style](#active-nav-link-style)
- [Create react app original notes](#getting-started-with-create-react-app)

## Packages

### MUI

    $ npm install @mui/material @emotion/react @emotion/styled

And for icons:

    $ npm install @mui/icons-material

The roboto font is also required:

    "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"

Use a link tag or do it in the style sheet.

### [react router](https://reactrouter.com/docs/en/v6/getting-started/installation)

### timeago.js

    $ npm install timeago.js

eg. 3 hours ago, 1 day ago, etc.

[Page top](#contents)

## Proxy

In package.json, add a proxy:

    "proxy": "http://localhost:8000/api"

This sets the base url. Now when fetching the api you just add the relative route.

eg. /auth/login

[Page top](#contents)

## React Context with createContext, useContext and useReducer

React context lets you share data with any component without having to pass it from parent to child using props.

useContext is a hook that helps you access the context using a different syntax.

useReducer is a way to change the value in the context. useState can be used but useReducer is better if the value is more complex / required more complex manipulation.

Using these things together is useful for sharing a state between any level of the component tree.

It is confusing at first but seperating the context (and useContext) from the useReducer and understanding them in isolation first before putting them together will help.

## useReducer

    const [state, dispatch] = useReducer(reducer, initialState);

This is kind of like useState:

    const [value, setValue] = useState(initialValue);

### state and initialState

State and initialState are equivalent to value and initialValue for the useState hook.

### Dispatch

The `dispatch` is what is used to invoke the reducer function and pass it an action. It equivalent to setValue.

### reducer

    const reducer = (state, action) => {
      // update the state with rules dictated by action, normally using a switch statement.

      return updatedState;
    }

You pass it your `state` (normally an object which contains the values for the current state) and an `action` which tells the reducer how to change the state.

The action typically will be an object that has a label or type and maybe a payload, which is the data to use to update the state. eg:

    {type: "INCREASE_STATE_BY_PAYLOAD, payload: 5}

You would pass it in using the dispatch:

    dispatch({type: "INCREASE_STATE_BY_PAYLOAD, payload: 5});

## Using context and useReducer together

To use the useReducer with context just setup the useReducer hook where the Context.Provider is setup and use the state to set the values passed in to the context. The dispatch is also passed into the context value.

A component can be created to deal with setting up the context.Provider. This component is exported and imported so it can be used to wrap our App (or other component). Every component within the wrapped component will have access to the context.

The allows the use of the dispatch function to set the state from anywhere we use the context (using the useContext hook).

### Helpful articles:

[React Context and useContext](https://www.freecodecamp.org/news/react-context-for-beginners/)

[useReducer](https://medium.com/swlh/usereducer-explained-d70e920692e)

[Page top](#contents)

# Axios delete with body

To receive data from `req.body.userId` in the backend, the data must be sent like below:

    axios.delete(URL, {
      data: {
        userId: '12345'
      }
    })

[Page top](#contents)

## Active Nav Link Style

There is an example in `components/navigation/menus/Hamburger.jsx`.

It uses `useMatch` and `useResolvedPath` from react-router-dom to check the active link so that a style can be conditionally applied.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

[Page top](#contents)
