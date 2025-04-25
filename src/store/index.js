import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './apis/apiSlice';
import { heritageApi } from './apis/heritageApi';
import { leaderboardApi } from './apis/leaderboardApi';
import { knowledgeTestApi } from './apis/knowledgeTestApi';
import authSlice from './slices/authSlice';
import paginationSlice from './slices/paginationSlice';
import { chatApi } from './apis/chatSlice';

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    auth: authSlice,
    [heritageApi.reducerPath]: heritageApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [knowledgeTestApi.reducerPath]: knowledgeTestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      heritageApi.middleware,
      leaderboardApi.middleware,
      knowledgeTestApi.middleware,
      apiSlice.middleware,
      chatApi.middleware // Added chatApi middleware
    ),
});

setupListeners(store.dispatch);