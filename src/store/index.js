import { configureStore } from '@reduxjs/toolkit'
import paginationSlice from './slices/paginationSlice'
import { heritageApi } from './apis/heritageApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { leaderboardApi } from './apis/leaderboardApi'
import { knowledgeTestApi } from './apis/knowledgeTestApi'

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    [heritageApi.reducerPath]: heritageApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [knowledgeTestApi.reducerPath]: knowledgeTestApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(heritageApi.middleware, leaderboardApi.middleware, knowledgeTestApi.middleware),
})

setupListeners(store.dispatch)
