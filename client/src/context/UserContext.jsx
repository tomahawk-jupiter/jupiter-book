import { useReducer } from "react";
import { createContext } from "react";

export const INITIAL_STATE = {
  user: null,
  isFetching: false,
  error: false,
  newPost: 0,
};
export const UserContext = createContext(INITIAL_STATE);

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        newPost: state.newPost,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        newPost: state.newPost,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
        newPost: state.newPost,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
        newPost: state.newPost,
      };
    case "UPDATE_USER_START":
      return {
        user: state.user,
        isFetching: true,
        error: false,
        newPost: state.newPost,
      };
    case "UPDATE_USER_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        newPost: state.newPost,
      };
    case "UPDATE_USER_FAILURE":
      return {
        user: state.user,
        isFetching: false,
        error: action.payload,
        newPost: state.newPost,
      };
    case "UPDATE_POSTS":
      return {
        user: state.user,
        isFetching: true,
        error: false,
        newPost: state.newPost,
      };
    case "POSTS_SUCCESS":
      return {
        user: state.user,
        isFetching: false,
        error: false,
        newPost: state.newPost + 1,
      };
    case "POSTS_FAILURE":
      return {
        user: state.user,
        isFetching: false,
        error: action.payload,
        newPost: state.newPost,
      };
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        newPost: state.newPost,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// const johnDoe = {
//   _id: "622fcae5d3a269300a6300d1",
//   username: "john doe",
//   email: "john@doe",
//   profilePicture: "",
//   coverPicture: "",
//   isAdmin: false,
//   location: "London",
//   friends: ["622fcb26d3a269300a6300d3"],
//   sentRequests: [],
//   receivedRequests: [],
// };
