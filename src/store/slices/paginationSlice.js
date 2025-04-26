import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  heritages: {
    currentPage: 1,
    itemsPerPage: 9,
    searchQuery: ''
  },
  favorites: {
    currentPage: 1,
    itemsPerPage: 9
  }
}

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    // Actions cho Heritage pagination
    setHeritagesPage: (state, action) => {
      state.heritages.currentPage = action.payload
    },
    setHeritagesSearchQuery: (state, action) => {
      state.heritages.searchQuery = action.payload
      state.heritages.currentPage = 1
    },
    
    // Actions cho Favorites pagination
    setFavoritesPage: (state, action) => {
      state.favorites.currentPage = action.payload
    }
  }
})

export const { 
  setHeritagesPage, 
  setHeritagesSearchQuery, 
  setFavoritesPage 
} = paginationSlice.actions

export default paginationSlice.reducer
