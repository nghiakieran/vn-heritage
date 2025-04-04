import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentPage: 1,
  itemsPerPage: 9,
  searchQuery: ''
}

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    }
  }
})

export const { setCurrentPage, setSearchQuery } = paginationSlice.actions
export default paginationSlice.reducer
