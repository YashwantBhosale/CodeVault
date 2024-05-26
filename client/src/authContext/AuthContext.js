import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { user: null, fetched: false, posts: [] };
    case "UPDATE":
      return { ...state, user: action.payload };
    case "FETCH_POSTS":
      return { ...state, posts: action.payload };
    case "UPDATE_POSTS":
      return { ...state, posts: action.payload };
    case "FETCH_USERS":
      return { ...state, public_users: action.payload };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    case "UPDATE_FETCH_STATE":
      return { ...state, fetched: action.payload };
    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "MOST_FAVOURITED_SNIPPETS":
      return { ...state, mostFavouritedSnippets: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    fetched: false,
    posts: [],
  });
  console.log("AuthContext state: ", state);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      if (sessionStorage.getItem("posts")) {
        sessionStorage.removeItem("posts");
      }
      if (sessionStorage.getItem("public_users")) {
        sessionStorage.removeItem("public_users");
      }
    } catch (error) {
      console.error(error.message);
    }
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
