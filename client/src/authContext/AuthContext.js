import { createContext, useReducer, useEffect } from "react";
export const AuthContext = createContext();
const BASE_URL = process.env.REACT_APP_BASE_URL;
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
    case "USER_LOADING":
      return { ...state, userLoading: action.payload };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    fetched: false,
    posts: [],
    userLoading: true,
  });
  console.log("AuthContext state: ", state);

  useEffect(() => {
    dispatch({ type: "USER_LOADING", payload: true });
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      console.log("validating jwt");
      fetch(BASE_URL + "api/user/verifyjwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          id: user?.id,
        }),
      })
        .then((res) => {
          try {
            console.log("res: ", res);
            if (res.status === 200) {
              // dispatch({ type: "USER_LOADING", payload: false });
              // dispatch({ type: "LOGIN", payload: user });
              console.log("control reached here1");

            } else {
              dispatch({ type: "USER_LOADING", payload: false });
              localStorage.removeItem("user");
              dispatch({ type: "LOGOUT" });
            }
            dispatch({ type: "USER_LOADING", payload: false });
            dispatch({ type: "LOGIN", payload: user });
            console.log("control reached here3");

            if (sessionStorage.getItem("posts")) {
              sessionStorage.removeItem("posts");
            }
            if (sessionStorage.getItem("public_users")) {
              sessionStorage.removeItem("public_users");
            }
          } catch (error) {
            localStorage.removeItem("user");
            dispatch({ type: "LOGOUT" });
            console.error(error.message);
          } finally {
            console.log("control reached here2");
            dispatch({ type: "USER_LOADING", payload: false });
          }
        })
        .catch((err) => {
          console.error(err.message);
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
          dispatch({ type: "USER_LOADING", payload: false });
        });
    }
    else{
      dispatch({ type: "USER_LOADING", payload: false });
    }
    // dispatch({ type: "USER_LOADING", payload: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
