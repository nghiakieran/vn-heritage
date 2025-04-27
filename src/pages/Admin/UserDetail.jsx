import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '~/components/common/ui/Button';
import { Label } from '~/components/common/ui/Label';
import { Input } from '~/components/common/ui/Input';
import { useGetUserByIdQuery, useUpdateUserMutation } from '~/store/apis/userSlice';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: user, isLoading, isError, error } = useGetUserByIdQuery(id);
    const [updateUser, { isLoading: isUpdating, isSuccess: updateSuccess, isError: updateError, error: updateErrorMessage }] = useUpdateUserMutation();
    const [formData, setFormData] = useState({
        displayname: '',
        role: '',
        phone: '',
        gender: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                displayname: user.displayname || '',
                role: user.role || 'member',
                phone: user.phone || '',
                gender: user.gender || 'other',
            });
        }
    }, [user]);

    useEffect(() => {
        if (updateSuccess) {
            // toast.success('Cập nhật thành công!'); // Tùy chọn
            navigate('/admin/users');
        }
        if (updateError) {
            console.error('Lỗi cập nhật:', updateErrorMessage);
            // toast.error(`Cập nhật thất bại: ${updateErrorMessage?.data?.message || 'Lỗi không xác định'}`); // Tùy chọn
        }
    }, [updateSuccess, updateError, updateErrorMessage, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = () => {
        updateUser({ id, ...formData });
    };

    if (isLoading) return <div className="text-center">Đang tải...</div>;
    if (isError) return <div className="text-center text-red-500">Lỗi khi tải dữ liệu: {error?.data?.message || error.error}</div>;
    if (!user) return <div className="text-center">Không tìm thấy người dùng.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Chi tiết Người dùng</h2>
            <div className="bg-white p-6 rounded-md shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="displayname">Tên hiển thị</Label>
                        <Input
                            type="text"
                            id="displayname"
                            name="displayname"
                            value={formData.displayname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" value={user?.account?.email || ''} disabled />
                    </div>
                    <div>
                        <Label htmlFor="role">Vai trò</Label>
                        <select
                            id="role"
                            name="role"
                            className="w-full p-2 border rounded"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="member">Member</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="gender">Giới tính</Label>
                        <select
                            id="gender"
                            name="gender"
                            className="w-full p-2 border rounded"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="men">Nam</option>
                            <option value="woman">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex space-x-4">
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/users')}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;