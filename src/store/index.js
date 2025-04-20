import { configureStore } from '@reduxjs/toolkit'
import paginationSlice from './slices/paginationSlice'
import { heritageApi } from './apis/heritageApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { leaderboardApi } from './apis/leaderboardApi'

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    [heritageApi.reducerPath]: heritageApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(heritageApi.middleware, leaderboardApi.middleware)
})

setupListeners(store.dispatch)
