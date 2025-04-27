// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '~/components/common/ui/Button';
// import { Input } from '~/components/common/ui/Input';
// import { Label } from '~/components/common/ui/Label';
// import { knowledgeTestModel } from '~/models/knowledgeTestModel';

// const KnowledgeTestDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [test, setTest] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     status: '',
//   });

//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const result = await knowledgeTestModel.findOneById(id);
//         setTest(result);
//         setFormData({
//           title: result.title,
//           content: result.content,
//           status: result.status,
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchTest();
//   }, [id]);

//   const handleUpdate = async () => {
//     try {
//       await knowledgeTestModel.updateOneById(id, formData);
//       alert('Cập nhật thành công!');
//     } catch (error) {
//       console.error(error);
//       alert('Cập nhật thất bại!');
//     }
//   };

//   if (!test) return <div>Đang tải...</div>;

//   return (
//     <div className='space-y-6'>
//       <h2 className='text-2xl font-semibold'>Chi tiết Bài kiểm tra</h2>
//       <div className='bg-white p-6 rounded-md shadow-md'>
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div>
//             <Label>Tiêu đề</Label>
//             <Input
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label>Nội dung</Label>
//             <Input
//               value={formData.content}
//               onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label>Trạng thái</Label>
//             <select
//               className='w-full p-2 border rounded'
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//             >
//               <option value='ACTIVE'>Kích hoạt</option>
//               <option value='INACTIVE'>Không kích hoạt</option>
//             </select>
//           </div>
//           <div>
//             <Label>Di sản ID</Label>
//             <Input value={test.heritageId} disabled />
//           </div>
//         </div>
//         <div className='mt-6 flex space-x-4'>
//           <Button onClick={handleUpdate}>Cập nhật</Button>
//           <Button variant='outline' onClick={() => navigate('/admin/knowledge-tests')}>
//             Quay lại
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KnowledgeTestDetail;