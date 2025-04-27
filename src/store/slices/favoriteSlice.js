import { createSlice } from '@reduxjs/toolkit'
import { favoriteSlice as favoriteApi } from '~/store/apis/favoritesSlice'

const initialState = {
  favoriteMap: {},
  isInitialized: false,
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteStatus: (state, action) => {
      const { heritageId, isFavorited } = action.payload
      if (isFavorited) {
        state.favoriteMap[heritageId] = true
      } else {
        delete state.favoriteMap[heritageId]
      }
    },
    resetFavorites: (state) => {
      state.favoriteMap = {}
      state.isInitialized = false
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      favoriteApi.endpoints.getFavoritesByUserId.matchFulfilled,
      (state, { payload }) => {
        if (payload && payload.favoriteMap) {
          state.favoriteMap = payload.favoriteMap
          state.isInitialized = true
        }
      }
    )
  },
})

export const { setFavoriteStatus, resetFavorites } = favoritesSlice.actions

export const selectFavoriteMap = (state) => state.favorites.favoriteMap
export const selectIsFavoriteInitialized = (state) => state.favorites.isInitialized
export const selectIsFavorited = (heritageId) => (state) => !!state.favorites.favoriteMap[heritageId]

export default favoritesSlice.reducer
