import { configureStore } from '@reduxjs/toolkit';
import paginationSlice from './slices/paginationSlice';
import { heritageApi } from './apis/heritageApi';
import authSlice from './slices/authSlice'; // Import authSlice
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './apis/apiSlice';

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    auth: authSlice, // Add authSlice reducer
    [heritageApi.reducerPath]: heritageApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Include apiSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(heritageApi.middleware)
      .concat(apiSlice.middleware), // Include apiSlice middleware
});

setupListeners(store.dispatch);