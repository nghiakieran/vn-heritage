import { configureStore } from '@reduxjs/toolkit'
import paginationSlice from './slices/paginationSlice'
import { heritageApi } from './apis/heritageApi'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    pagination: paginationSlice,
    [heritageApi.reducerPath]: heritageApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(heritageApi.middleware)
})

setupListeners(store.dispatch)
