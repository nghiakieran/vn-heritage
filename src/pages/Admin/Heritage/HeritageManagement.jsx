import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/common/ui/Button'
import { Input } from '~/components/common/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/common/ui/Table'
import { Search, Trash2, Edit } from 'lucide-react'
import { useDeleteHeritageMutation, useGetHeritagesQuery } from '~/store/apis/heritageApi'
import { toast } from 'react-toastify'

const HeritageManagement = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [page, setPage] = useState(1)

    const { data, isLoading, isError, error } = useGetHeritagesQuery({
        page,
        limit: 10,
        name: searchTerm,
        status: statusFilter,
    })

    const [deleteHeritage] = useDeleteHeritageMutation()

    const heritages = data?.heritages || []
    const pagination = data?.pagination || {}
    const totalItems = pagination.totalItems || 0
    const currentPage = pagination.currentPage || page
    const totalPages = pagination.totalPages || 1

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa di tích này?')) {
            try {
                await deleteHeritage(id).unwrap()
                toast.success('Xóa di tích thành công!')
            } catch (err) {
                console.error('Lỗi khi xóa di tích:', err)
                toast.error(`Xóa di tích thất bại: ${err?.data?.message || 'Lỗi không xác định'}`)
            }
        }
    }


    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (isError)
        return (
            <div className="text-center text-red-500">
                Lỗi: {error?.data?.message || 'Không thể tải danh sách di tích'}
            </div>
        )

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Quản lý Di tích Lịch sử</h2>
            <div className="flex justify-between items-center">
                <div className="relative w-64">
                    <Input
                        placeholder="Tìm kiếm theo tên"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <div className="flex space-x-4">
                    <select
                        className="p-2 border rounded"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Không hoạt động</option>
                    </select>
                    <Button onClick={() => navigate('/admin/heritages/new')}>
                        Thêm Di tích
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên Di tích</TableHead>
                        <TableHead>Địa điểm</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {heritages.map((heritage) => (
                        <TableRow key={heritage._id}>
                            <TableCell maxWidth='250px'>{heritage.name}</TableCell>
                            <TableCell>{heritage.location}</TableCell>
                            <TableCell>{heritage.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                            <TableCell>
                                {new Date(heritage.createdAt).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/heritages/${heritage._id}`)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(heritage._id)}
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
                    <p>Tổng: {totalItems} di tích</p>
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

export default HeritageManagement
