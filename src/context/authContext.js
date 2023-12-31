import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

// const fetchUser = async (token) => {
//   if (!token) return null;
//   console.log("Hello    fetchUser   token:", token);

//   try {
//     const res = await axios.get(
//       `${process.env.REACT_APP_BASE_BACKEND_URL}/user/getUser/${token}`
//     );
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// };

const INITIAL_STATE = {
  user:     {
    "_id": "65725d5818e606554d834939",
    "firstName": "John",
    "lastName": "Doe",
    "email": "jd@northeastern.edu",
    "password": "$2b$10$CcDfXhG6MpNq1O1JJLDHw.awcahsLWkU5DeatUgUnfVmsmyDseiDC",
    "phone": "7373185494",
    "role": "organizer",
    "profileImg": null,
    "registeredEvents": [],
    "yourEvents": []
},
  loading: true,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // useEffect(() => {
  //   const token = localStorage.getItem("token") || null;

  //   const fetchData = async () => {
  //     try {
  //       const user = await fetchUser(token);
  //       dispatch({ type: "LOGIN_SUCCESS", payload: user });
  //     } catch (error) {
  //       dispatch({ type: "LOGIN_FAILURE", payload: error.message });
  //     }
  //   };

  //   if (token) {
  //     fetchData();
  //   } else {
  //     dispatch({ type: "LOGOUT" });
  //   }
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        refreshUser: async () => {
          try {
            const res = await axios.get(
              `${process.env.REACT_APP_BASE_BACKEND_URL}/user/get/${state?.user?._id}`
            );
            dispatch({ type: "UPDATE_USER", payload: res.data });
          } catch (error) {
            console.error("Error refreshing user:", error);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
