import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, XCircle, Trash2, Eye, Users } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

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
  const [selectedApplication, setSelectedApplication] = useState<TheOfficeApplication | null>(null);
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
          age: data.age?.toString() || '',
          phone: data.phone,
          englishLevel: data.englishLevel,
          email: data.email,
          preferredSession: data.preferredSession,
          attendanceConfirmation: data.attendanceConfirmation,
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

  const exportToCSV = () => {
    const headers = [
      'الاسم الكامل', 
      'العمر', 
      'الهاتف', 
      'مستوى الإنجليزية',
      'الحصة المفضلة',
      'تأكيد الحضور',
      'البريد الإلكتروني', 
      'الحالة', 
      'تاريخ التقديم'
    ].join(',');

    const rows = filteredApplications.map(app => [
      `"${app.fullName}"`,
      `"${app.age}"`,
      `"${app.phone}"`,
      `"${app.englishLevel}"`,
      `"${app.preferredSession || ''}"`,
      `"${app.attendanceConfirmation || ''}"`,
      `"${app.email || ''}"`,
      app.status === 'pending' ? 'قيد المراجعة' : 
        app.status === 'approved' ? 'مقبول' : 'مرفوض',
      `"${format(app.applicationDate, 'yyyy-MM-dd HH:mm', { locale: arSA })}"`
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `طلبات_The_Office_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
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

  return (
    <>
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">طلبات نادي The Office</h2>
          <p className="text-gray-600 mt-1">إدارة ومتابعة طلبات نادي The Office</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
        >
          <Download size={18} />
          تصدير البيانات
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'إجمالي الطلبات', 
            value: stats.total, 
            icon: Users, 
            color: 'bg-[#22b0fc]' 
          },
          { 
            title: 'قيد المراجعة', 
            value: stats.pending, 
            icon: Users, 
            color: 'bg-yellow-500' 
          },
          { 
            title: 'مقبولة', 
            value: stats.approved, 
            icon: CheckCircle, 
            color: 'bg-green-500' 
          },
          { 
            title: 'مرفوضة', 
            value: stats.rejected, 
            icon: XCircle, 
            color: 'bg-red-500' 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} text-white rounded-xl p-4 shadow-md`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف أو البريد..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22b0fc] focus:border-[#22b0fc] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">العمر</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الهاتف</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">مستوى الإنجليزية</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحصة</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{app.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{app.age}</td>
                    <td className="px-4 py-3 text-sm text-gray-800" dir="ltr">{app.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{app.englishLevel}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{app.preferredSession || 'غير محدد'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : app.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status === 'pending' 
                          ? 'قيد المراجعة' 
                          : app.status === 'approved' 
                            ? 'مقبول' 
                            : 'مرفوض'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {format(app.applicationDate, 'yyyy/MM/dd', { locale: arSA })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedApplication(app)}
                          className="p-1.5 text-[#22b0fc] hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={18} />
                        </motion.button>
                        
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
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف الطلب"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">لا توجد طلبات متطابقة مع معايير البحث</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">تفاصيل طلب The Office</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">الاسم الكامل</p>
                    <p className="font-medium">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العمر</p>
                    <p className="font-medium">{selectedApplication.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-medium" dir="ltr">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">مستوى الإنجليزية</p>
                    <p className="font-medium">{selectedApplication.englishLevel}</p>
                  </div>
                  {selectedApplication.preferredSession && (
                    <div>
                      <p className="text-sm text-gray-500">الحصة المفضلة</p>
                      <p className="font-medium">{selectedApplication.preferredSession}</p>
                    </div>
                  )}
                  {selectedApplication.attendanceConfirmation && (
                    <div>
                      <p className="text-sm text-gray-500">تأكيد الحضور</p>
                      <p className="font-medium">{selectedApplication.attendanceConfirmation}</p>
                    </div>
                  )}
                  {selectedApplication.email && (
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التقديم</p>
                    <p className="font-medium">
                      {format(selectedApplication.applicationDate, 'yyyy/MM/dd HH:mm', { locale: arSA })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    selectedApplication.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={selectedApplication.status === 'approved'}
                >
                  <CheckCircle size={18} />
                  {selectedApplication.status === 'approved' ? 'تم القبول' : 'قبول الطلب'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    selectedApplication.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  disabled={selectedApplication.status === 'rejected'}
                >
                  <XCircle size={18} />
                  {selectedApplication.status === 'rejected' ? 'تم الرفض' : 'رفض الطلب'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(selectedApplication.id)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  حذف الطلب
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
    </>
  );
};

export default TheOfficeApplications; 