import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/common/ui/Button';
import { Input } from '~/components/common/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/common/ui/Table';
import { Search, Trash2, Edit } from 'lucide-react';
import { useDeleteHeritageMutation, useGetHeritagesQuery, } from '~/store/apis/heritageApi';

const HeritageManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, isError, error } = useGetHeritagesQuery({
    page,
    limit,
    name: searchTerm,
    status: statusFilter,
  });

  console.log(data);

  const [deleteHeritage] = useDeleteHeritageMutation();

  const heritages = data?.heritages || [];
  const totalCount = data?.pagination?.totalItems || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa di tích này?')) {
      try {
        await deleteHeritage(id).unwrap();
        // toast.success('Xóa di tích thành công!');
      } catch (err) {
        console.error('Lỗi khi xóa di tích:', err);
        // toast.error(`Xóa di tích thất bại: ${err?.data?.message || 'Lỗi không xác định'}`);
      }
    }
  };

  if (isLoading) return <div className="text-center">Đang tải...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Lỗi: {error?.data?.message || 'Không thể tải danh sách di tích'}
      </div>
    );

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
              <TableCell>{heritage.name}</TableCell>
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
        <p>Tổng: {totalCount} di tích</p>
        <div className="flex items-center space-x-4">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </Button>
          {totalPages > 0 && (
            <span>Trang {page} / {totalPages}</span>
          )}
          <Button
            disabled={page * limit >= totalCount}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeritageManagement;
