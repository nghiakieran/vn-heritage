import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import { apiSlice } from './apis/apiSlice'
import paginationSlice from './slices/paginationSlice'
import { heritageApi } from './apis/heritageApi'
import { leaderboardApi } from './apis/leaderboardApi'
import { knowledgeTestApi } from './apis/knowledgeTestApi'
import { userApi } from './apis/userSlice'
import { favoriteApi } from './apis/favoriteApi'

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    auth: authSlice,
    [heritageApi.reducerPath]: heritageApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [knowledgeTestApi.reducerPath]: knowledgeTestApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [favoriteApi.reducerPath]: favoriteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(heritageApi.middleware, leaderboardApi.middleware,
      knowledgeTestApi.middleware, apiSlice.middleware, userApi.middleware, favoriteApi.middleware),
})

setupListeners(store.dispatch)
