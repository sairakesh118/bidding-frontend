import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/appSlice";
import authReducer from "./features/auth/authSlice";



const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware),
  devTools: import.meta.env.MODE !== 'production',
});



export default store;
