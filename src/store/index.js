import authSlice from './slices/authSlice';
import { chatApi } from './apis/chatSlice';
import authSlice from './slices/authSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './apis/apiSlice'
import { configureStore } from '@reduxjs/toolkit'
import paginationSlice from './slices/paginationSlice'
import { heritageApi } from './apis/heritageApi'
import { leaderboardApi } from './apis/leaderboardApi'
import { knowledgeTestApi } from './apis/knowledgeTestApi'
import { userApi } from './apis/userSlice'


export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    auth: authSlice,
    [heritageApi.reducerPath]: heritageApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [knowledgeTestApi.reducerPath]: knowledgeTestApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },


  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(heritageApi.middleware, leaderboardApi.middleware, 
      knowledgeTestApi.middleware, apiSlice.middleware, userApi.middleware, chatApi.middleware // Added chatApi middleware),
})


setupListeners(store.dispatch)
