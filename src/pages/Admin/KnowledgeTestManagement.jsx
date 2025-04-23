// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '~/components/common/ui/Button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/common/ui/Table';
// import { Search, Trash2, Edit } from 'lucide-react';
// import { knowledgeTestModel } from '~/models/knowledgeTestModel';
// import { Input } from 'postcss';

// const KnowledgeTestManagement = () => {
//   const navigate = useNavigate();
//   const [tests, setTests] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const fetchTests = async () => {
//     try {
//       const filter = searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {};
//       const { results, totalCount } = await knowledgeTestModel.findList({
//         filter,
//         skip: (page - 1) * limit,
//         limit,
//       });
//       setTests(results);
//       setTotalCount(totalCount);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchTests();
//   }, [page, searchTerm]);

//   const handleDelete = async (id) => {
//     if (window.confirm('Bạn có chắc muốn xóa bài kiểm tra này?')) {
//       try {
//         await knowledgeTestModel.deleteOneById(id);
//         fetchTests();
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div className='space-y-6'>
//       <h2 className='text-2xl font-semibold'>Quản lý Bài kiểm tra Kiến thức</h2>
//       <div className='flex justify-between items-center'>
//         <div className='relative w-64'>
//           <Input
//             placeholder='Tìm kiếm theo tiêu đề'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className='pl-10'
//           />
//           <Search className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' />
//         </div>
//         <Button onClick={() => navigate('/admin/knowledge-tests/new')}>Thêm Bài kiểm tra</Button>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Tiêu đề</TableHead>
//             <TableHead>Di sản</TableHead>
//             <TableHead>Trạng thái</TableHead>
//             <TableHead>Lượt làm</TableHead>
//             <TableHead>Ngày tạo</TableHead>
//             <TableHead>Hành động</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {tests.map((test) => (
//             <TableRow key={test._id}>
//               <TableCell>{test.title}</TableCell>
//               <TableCell>{test.heritageId}</TableCell>
//               <TableCell>{test.status}</TableCell>
//               <TableCell>{test.stats.totalAttempts}</TableCell>
//               <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
//               <TableCell>
//                 <Button
//                   variant='ghost'
//                   size='sm'
//                   onClick={() => navigate(`/admin/knowledge-tests/${test._id}`)}
//                 >
//                   <Edit className='w-4 h-4' />
//                 </Button>
//                 <Button
//                   variant='ghost'
//                   size='sm'
//                   onClick={() => handleDelete(test._id)}
//                 >
//                   <Trash2 className='w-4 h-4 text-red-500' />
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <div className='flex justify-between items-center'>
//         <p>Tổng: {totalCount} bài kiểm tra</p>
//         <div className='space-x-2'>
//           <Button
//             disabled={page === 1}
//             onClick={() => setPage(page - 1)}
//           >
//             Trước
//           </Button>
//           <Button
//             disabled={page * limit >= totalCount}
//             onClick={() => setPage(page + 1)}
//           >
//             Sau
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KnowledgeTestManagement;