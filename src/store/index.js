import authSlice from './slices/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './apis/apiSlice'
import { configureStore } from '@reduxjs/toolkit'
import paginationSlice from './slices/paginationSlice'

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },


  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});


setupListeners(store.dispatch)
