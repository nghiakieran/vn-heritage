import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/common/ui/Button'
import { Input } from '~/components/common/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/common/ui/Table'
import { Search, Trash2, Edit, Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import { useDeleteKnowledgeTestMutation, useGetKnowledgeTestsQuery } from '~/store/apis/knowledgeTestApi'

const KnowledgeTestManagement = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [page, setPage] = useState(1)

    const { data, isLoading, isError, error } = useGetKnowledgeTestsQuery({
        page,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
    })

    console.log(data);

    const [deleteKnowledgeTest] = useDeleteKnowledgeTestMutation()

    const tests = data?.results || []
    const pagination = data?.pagination || {}
    const totalItems = pagination.totalItems || 0
    const currentPage = pagination.currentPage || page
    const totalPages = pagination.totalPages || 1

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài kiểm tra này?')) {
            try {
                await deleteKnowledgeTest(id).unwrap()
                toast.success('Xóa bài kiểm tra thành công!')
            } catch (err) {
                console.error('Lỗi khi xóa bài kiểm tra:', err)
                toast.error(`Xóa bài kiểm tra thất bại: ${err?.data?.message || 'Lỗi không xác định'}`)
            }
        }
    }

    if (isLoading) return <div className="text-center">Đang tải...</div>
    if (isError)
        return (
            <div className="text-center text-red-500">
                Lỗi: {error?.data?.message || 'Không thể tải danh sách bài kiểm tra'}
            </div>
        )

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Quản lý Bài Kiểm tra Kiến thức</h2>
            <div className="flex justify-between items-center">
                <div className="relative w-64">
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề"
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
                    <Button onClick={() => navigate('/admin/knowledge-tests/new')}>
                        Thêm Bài Kiểm tra
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Heritage ID</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tests.map((test) => (
                        <TableRow key={test._id}>
                            <TableCell maxWidth="250px">{test.title}</TableCell>
                            <TableCell>{test.heritageId}</TableCell>
                            <TableCell>{test.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                            <TableCell>
                                {new Date(test.createdAt).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/knowledge-tests/${test._id}`)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(test._id)}
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
                    <p>Tổng: {totalItems} bài kiểm tra</p>
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

export default KnowledgeTestManagement