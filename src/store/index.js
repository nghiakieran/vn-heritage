import authSlice from './slices/authSlice'; // Import authSlice
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './apis/apiSlice';
import { configureStore } from '@reduxjs/toolkit'
import paginationSlice from './slices/paginationSlice'
import { heritageApi } from './apis/heritageApi'
import { leaderboardApi } from './apis/leaderboardApi'
import { knowledgeTestApi } from './apis/knowledgeTestApi'

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    auth: authSlice,
    [heritageApi.reducerPath]: heritageApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [knowledgeTestApi.reducerPath]: knowledgeTestApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(heritageApi.middleware, leaderboardApi.middleware, knowledgeTestApi.middleware, apiSlice.middleware),
})

setupListeners(store.dispatch);