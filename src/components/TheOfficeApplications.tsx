import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

interface TheOfficeApplication {
  id: string;
  fullName: string;
  age: string;
  phone: string;
  englishLevel: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
}

const TheOfficeApplications = ({ isAdmin }: { isAdmin: boolean }) => {
  const [applications, setApplications] = useState<TheOfficeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(
      collection(db, 'clubApplications'),
      where('clubName', '==', 'The Office'),
      orderBy('applicationDate', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps: TheOfficeApplication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({
          id: doc.id,
          fullName: data.fullName,
          age: data.age,
          phone: data.phone,
          englishLevel: data.englishLevel,
          email: data.email,
          status: data.status || 'pending',
          applicationDate: data.applicationDate?.toDate?.() || new Date(),
        });
      });
      setApplications(apps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm ||
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleStatusChange = async (appId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'clubApplications', appId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (appId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      try {
        await deleteDoc(doc(db, 'clubApplications', appId));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22b0fc] mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل طلبات The Office...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">ليس لديك صلاحية الوصول إلى طلبات The Office.</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">طلبات نادي The Office</h2>
          <p className="text-gray-600 mt-1">إدارة ومتابعة طلبات نادي The Office</p>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-right">الاسم الكامل</th>
              <th className="px-4 py-2 text-right">العمر</th>
              <th className="px-4 py-2 text-right">رقم الهاتف</th>
              <th className="px-4 py-2 text-right">مستوى الإنجليزية</th>
              <th className="px-4 py-2 text-right">البريد الإلكتروني</th>
              <th className="px-4 py-2 text-right">الحالة</th>
              <th className="px-4 py-2 text-right">تاريخ التقديم</th>
              <th className="px-4 py-2 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{app.fullName}</td>
                <td className="px-4 py-2">{app.age}</td>
                <td className="px-4 py-2">{app.phone}</td>
                <td className="px-4 py-2">{app.englishLevel}</td>
                <td className="px-4 py-2">{app.email || '-'}</td>
                <td className="px-4 py-2">
                  {app.status === 'pending' ? 'قيد المراجعة' : app.status === 'approved' ? 'مقبول' : 'مرفوض'}
                </td>
                <td className="px-4 py-2">{app.applicationDate.toLocaleDateString('ar-EG')}</td>
                <td className="px-4 py-2 flex gap-2">
                  {app.status !== 'approved' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStatusChange(app.id, 'approved')}
                      className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="قبول الطلب"
                    >
                      <CheckCircle size={18} />
                    </motion.button>
                  )}
                  {app.status !== 'rejected' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="رفض الطلب"
                    >
                      <XCircle size={18} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="حذف الطلب"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TheOfficeApplications; 