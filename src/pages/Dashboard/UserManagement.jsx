import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Paper
} from '@mui/material'
import DataTable from '~/components/admin/DataTable'
import { users } from '~/api/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { MoreHoriz, Add } from '@mui/icons-material'
import { useState } from 'react'

export default function UserManagement() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const columns = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar sx={{ width: 32, height: 32 }} alt={user.name} src={user.avatar} />
          <div>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (user) => (
        <Chip
          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          color={
            user.role === 'admin'
              ? 'primary'
              : user.role === 'editor'
                ? 'secondary'
                : 'default'
          }
          size="small"
        />
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (user) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              height: 8,
              width: 8,
              borderRadius: '50%',
              marginRight: 8,
              backgroundColor: user.status === 'active' ? '#4caf50' : '#bdbdbd'
            }}
          />
          <Typography>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Typography>
        </div>
      )
    },
    {
      header: 'Last Active',
      accessorKey: 'lastActive',
      cell: (user) => (
        <Typography color="text.secondary">
          {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
        </Typography>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: () => (
        <div>
          <IconButton size="small" onClick={handleClick}>
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={handleClose}>Edit</MenuItem>
            <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" fontWeight="bold">Users</Typography>
          <Typography color="text.secondary">
            Manage your team members and their permissions
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />}>
          Add User
        </Button>
      </div>

      <Paper elevation={1}>
        <CardHeader
          title={<Typography variant="h6">All Users</Typography>}
          sx={{ pb: 1 }}
        />
        <CardContent>
          <DataTable data={users} columns={columns} />
        </CardContent>
      </Paper>
    </div>
  )
}
