// Selectors cho Heritage pagination
export const selectHeritagesCurrentPage = (state) => state.pagination.heritages.currentPage
export const selectHeritagesItemsPerPage = (state) => state.pagination.heritages.itemsPerPage
export const selectHeritagesSearchQuery = (state) => state.pagination.heritages.searchQuery

// Selectors cho Favorites pagination
export const selectFavoritesCurrentPage = (state) => state.pagination.favorites.currentPage
export const selectFavoritesItemsPerPage = (state) => state.pagination.favorites.itemsPerPage
