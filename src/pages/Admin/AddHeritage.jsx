import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/components/common/ui/Button';
import { Label } from '~/components/common/ui/Label';
import { Input } from '~/components/common/ui/Input';
import { useCreateHeritageMutation } from '~/store/apis/heritageApi';
import { toast } from 'react-toastify';

const AddHeritage = () => {
    const navigate = useNavigate();
    const [createHeritage, { isLoading: isCreating, isSuccess: createSuccess, isError: createError, error: createErrorMessage }] = useCreateHeritageMutation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        coordinates: { latitude: '', longitude: '' },
        status: 'ACTIVE',
    });

    useEffect(() => {
        if (createSuccess) {
            toast.success('Tạo di tích thành công!');
            navigate('/admin/heritages');
        }
        if (createError) {
            console.error('Lỗi tạo di tích:', createErrorMessage);
            const errorMsg = createErrorMessage?.data?.message || createErrorMessage?.error || 'Lỗi không xác định';
            toast.error(`Tạo di tích thất bại: ${errorMsg}`);
        }
    }, [createSuccess, createError, createErrorMessage, navigate]);

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

    const handleCreate = () => {
        if (!formData.name.trim()) {
            toast.error('Tên di tích không được để trống!');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Mô tả không được để trống!');
            return;
        }
        if (!formData.location.trim()) {
            toast.error('Địa điểm không được để trống!');
            return;
        }
        if (!formData.coordinates.latitude || !formData.coordinates.longitude) {
            toast.error('Tọa độ không được để trống!');
            return;
        }
        createHeritage(formData);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Thêm Di tích Lịch sử</h2>
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
                    <Button onClick={handleCreate} disabled={isCreating}>
                        {isCreating ? 'Đang tạo...' : 'Tạo'}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/admin/heritages')}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddHeritage;