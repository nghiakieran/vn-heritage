import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/common/ui/Button'
import { Input } from '~/components/common/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/common/ui/Table'
import { Search, Trash2, Edit, UserCog } from 'lucide-react'
import { useGetAllQuery, useDeleteUserMutation } from '~/store/apis/userSlice'
import { toast } from 'react-toastify'

const UserManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError, error } = useGetAllQuery({
    page,
    limit,
    search: searchTerm,
    role: roleFilter !== 'ALL' ? roleFilter : undefined,
  })

  const [deleteUser] = useDeleteUserMutation()

  const users = data?.users || []
  const pagination = data?.pagination || {}
  const totalItems = pagination.totalItems || 0
  const currentPage = pagination.currentPage || page
  const totalPages = pagination.totalPages || 1

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteUser(id).unwrap()
        toast.success('Xóa người dùng thành công!')
      } catch (err) {
        console.error('Lỗi khi xóa người dùng:', err)
        toast.error('Xóa người dùng thất bại!')
      }
    }
  }

  if (isLoading) return <div className="text-center">Đang tải...</div>
  if (isError) return <div className="text-center text-red-500">Lỗi: {error?.data?.message || 'Không thể tải danh sách người dùng'}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCog className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Quản lý Người dùng</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Input
            placeholder="Tìm kiếm theo tên/email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex space-x-4">
          <select
            className="p-2 border rounded"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên hiển thị</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="flex items-center gap-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.displayname?.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.displayname}
              </TableCell>
              <TableCell>{user.account.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}>
                  {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.account.isActive ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </TableCell>
              <TableCell>{new Date(user.createAt).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <p>Tổng: {totalItems} người dùng</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Trước
          </Button>
          {totalPages > 0 && (
            <span>Trang {currentPage} / {totalPages}</span>
          )}
          <Button
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement

