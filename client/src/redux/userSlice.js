import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    error: null,
    user: null, // Add a `user` field to store user details if needed.
    isAuth: null,
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload; // Set user details when logging in.
    },
    setUserAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
});




export const {
  setIsLoggedIn,
  setError,
  resetError,
  setUser,
  logout,
  setUserAuth,
} = userSlice.actions;

export default userSlice.reducer;
