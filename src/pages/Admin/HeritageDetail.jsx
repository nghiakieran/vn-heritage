import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '~/components/common/ui/Button';
import { Label } from '~/components/common/ui/Label';
import { Input } from '~/components/common/ui/Input';
import { toast } from 'react-toastify';
import { useGetHeritagesByIdQuery, useUpdateHeritageMutation } from '~/store/apis/heritageApi';

const HeritageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: heritage, isLoading, isError, error } = useGetHeritagesByIdQuery(id);
    const [updateHeritage, { isLoading: isUpdating, isSuccess: updateSuccess, isError: updateError, error: updateErrorMessage }] = useUpdateHeritageMutation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        coordinates: { latitude: '', longitude: '' },
        status: 'ACTIVE',
    });

    useEffect(() => {
        if (heritage) {
            setFormData({
                name: heritage.name || '',
                description: heritage.description || '',
                location: heritage.location || '',
                coordinates: {
                    latitude: heritage.coordinates?.latitude || '',
                    longitude: heritage.coordinates?.longitude || '',
                },
                status: heritage.status || 'ACTIVE',
            });
        }
    }, [heritage]);

    useEffect(() => {
        if (updateSuccess) {
            toast.success('Cập nhật di tích thành công!');
            navigate('/admin/heritages');
        }
        if (updateError) {
            console.error('Lỗi cập nhật:', updateErrorMessage);
            const errorMsg = updateErrorMessage?.data?.message || updateErrorMessage?.error || 'Lỗi không xác định';
            toast.error(`Cập nhật di tích thất bại: ${errorMsg}`);
        }
    }, [updateSuccess, updateError, updateErrorMessage, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('coordinates.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                coordinates: { ...formData.coordinates, [field]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleUpdate = () => {
        console.log(formData);
        updateHeritage({ id, formData });
    };

    if (isLoading) return <div className="text-center">Đang tải...</div>;
    if (isError) {
        const errorMsg = error?.data?.message || error?.error || 'Lỗi không xác định';
        return <div className="text-center text-red-500">Lỗi khi tải dữ liệu: {errorMsg}</div>;
    }
    if (!heritage) return <div className="text-center">Không tìm thấy di tích.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Chi tiết Di tích Lịch sử</h2>
            <div className="bg-white p-6 rounded-md shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name">Tên di tích</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="location">Địa điểm</Label>
                        <Input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="coordinates.latitude">Vĩ độ</Label>
                        <Input
                            type="text"
                            id="coordinates.latitude"
                            name="coordinates.latitude"
                            value={formData.coordinates.latitude}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="coordinates.longitude">Kinh độ</Label>
                        <Input
                            type="text"
                            id="coordinates.longitude"
                            name="coordinates.longitude"
                            value={formData.coordinates.longitude}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="status">Trạng thái</Label>
                        <select
                            id="status"
                            name="status"
                            className="w-full p-2 border rounded"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Không hoạt động</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <textarea
                            id="description"
                            name="description"
                            className="w-full p-2 border rounded"
                            rows="4"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="mt-6 flex space-x-4">
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/heritages')}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeritageDetail;