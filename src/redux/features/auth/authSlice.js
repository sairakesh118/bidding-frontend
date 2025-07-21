import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isAuthenticated: Boolean(token),
    };
  } catch (err) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      const tokenExpiry= Date.now() + 24 * 60 * 60 * 1000;
   
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', tokenExpiry);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('tokenExpiry');
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
