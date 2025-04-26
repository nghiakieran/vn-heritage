import { createSlice } from '@reduxjs/toolkit'
import { favoriteApi } from '~/store/apis/favoriteApi'

const initialState = {
  favoriteMap: {},
  isInitialized: false
}

const favoriteSlice = createSlice({
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
    }
  },
  extraReducers: (builder) => {
    // Khi lấy danh sách yêu thích thành công, cập nhật favoriteMap
    builder.addMatcher(
      favoriteApi.endpoints.getFavoritesByUserId.matchFulfilled,
      (state, { payload }) => {
        if (payload && payload.favoriteMap) {
          state.favoriteMap = payload.favoriteMap
          state.isInitialized = true
        }
      }
    )
  }
})

export const { setFavoriteStatus, resetFavorites } = favoriteSlice.actions

export const selectFavoriteMap = (state) => state.favorites.favoriteMap
export const selectIsFavoriteInitialized = (state) => state.favorites.isInitialized
export const selectIsFavorited = (heritageId) => (state) => !!state.favorites.favoriteMap[heritageId]

export default favoriteSlice.reducer
