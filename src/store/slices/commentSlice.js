import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  comments: [], // Store array of comments
  loading: false,
  error: null
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    addCommentStart: (state) => {
      state.loading = true
      state.error = null
    },
    addCommentSuccess: (state, action) => {
      state.loading = false
      state.comments.push(action.payload)
    },
    addCommentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    setComments: (state, action) => {
      state.comments = action.payload
      state.loading = false
      state.error = null
    }
  }
})

export const { addCommentStart, addCommentSuccess, addCommentFailure, setComments } = commentSlice.actions

export default commentSlice.reducer

// Update selectors to use state.comments instead of state.comment
export const selectComments = (state) => state.comments.comments
export const selectCommentLoading = (state) => state.comments.loading
export const selectCommentError = (state) => state.comments.error