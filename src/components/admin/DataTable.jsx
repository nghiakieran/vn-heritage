import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box
} from '@mui/material'
import { Search, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export default function DataTable({
  data,
  columns,
  searchable = true,
  pagination = true
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Basic search filter
  const filteredData = searchable && searchQuery.length > 0
    ? data.filter((item) => {
      return Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    : data

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {searchable && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.header}>
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No results found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell(row)
                        : row[column.accessorKey]?.toString()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && totalPages > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
            {filteredData.length} results
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page
              </Typography>
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                sx={{ minWidth: 80 }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}