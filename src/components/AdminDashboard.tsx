import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Filter, Eye, Download, Users, Calendar, TrendingUp } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { Application } from '../types';

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'all' | 'basic' | 'full'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('submissionDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps: Application[] = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as Application);
      });
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter(app => 
          app.registrationType.toLowerCase() === filter
        )
      );
    }
  }, [applications, filter]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const stats = {
    total: applications.length,
    basic: applications.filter(app => app.registrationType === 'Basic').length,
    full: applications.filter(app => app.registrationType === 'Full').length,
    thisMonth: applications.filter(app => {
      const appDate = new Date(app.submissionDate);
      const now = new Date();
      return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6"
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
            <p className="text-blue-200">إدارة طلبات التسجيل</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
          >
            <LogOut className="w-5 h-5 ml-2" />
            تسجيل الخروج
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'إجمالي التسجيلات', value: stats.total, icon: Users, color: '[#22b0fc]' },
          { title: 'تسجيل أولي', value: stats.basic, icon: Users, color: 'cyan' },
          { title: 'تسجيل كامل', value: stats.full, icon: TrendingUp, color: 'green' },
          { title: 'هذا الشهر', value: stats.thisMonth, icon: Calendar, color: '[#22b0fc]' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center`}
          >
            <div className={`w-12 h-12 bg-${stat.color}-500 rounded-xl flex items-center justify-center mx-auto mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
            <p className="text-gray-300">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'الكل', color: '[#22b0fc]' },
            { key: 'basic', label: 'أولي', color: 'cyan' },
            { key: 'full', label: 'كامل', color: 'green' },
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === filterOption.key
                  ? `bg-${filterOption.color}-500 text-white shadow-lg`
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {filterOption.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-right text-white font-semibold">الاسم</th>
                <th className="px-6 py-4 text-right text-white font-semibold">الهاتف</th>
                <th className="px-6 py-4 text-right text-white font-semibold">الدورة</th>
                <th className="px-6 py-4 text-right text-white font-semibold">النوع</th>
                <th className="px-6 py-4 text-right text-white font-semibold">التاريخ</th>
                <th className="px-6 py-4 text-right text-white font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white">{app.fullName}</td>
                  <td className="px-6 py-4 text-white" dir="ltr">{app.phone}</td>
                  <td className="px-6 py-4 text-white">{app.course}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      app.registrationType === 'Basic'
                        ? 'bg-[#22b0fc]/20 text-blue-200'
                        : 'bg-green-500/20 text-green-200'
                    }`}>
                      {app.registrationType === 'Basic' ? 'أولي' : 'كامل'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {new Date(app.submissionDate).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedApplication(app)}
                      className="bg-[#22b0fc] hover:bg-[#1a9de8] text-white p-2 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 text-white">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">لا توجد طلبات مسجلة</p>
          </div>
        )}
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">تفاصيل التسجيل</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-white hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-white">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300">الاسم الكامل</label>
                  <p className="text-lg">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">العمر</label>
                  <p className="text-lg">{selectedApplication.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">رقم الهاتف</label>
                  <p className="text-lg" dir="ltr">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">البريد الإلكتروني</label>
                  <p className="text-lg">{selectedApplication.email || 'غير متوفر'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">الولاية</label>
                  <p className="text-lg">{selectedApplication.wilaya}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">المستوى التعليمي</label>
                  <p className="text-lg">{selectedApplication.education}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">الدورة</label>
                  <p className="text-lg">{selectedApplication.course}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300">نوع التسجيل</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedApplication.registrationType === 'Basic'
                      ? 'bg-[#22b0fc]/20 text-blue-200'
                      : 'bg-green-500/20 text-green-200'
                  }`}>
                    {selectedApplication.registrationType === 'Basic' ? 'أولي' : 'كامل'}
                  </span>
                </div>
              </div>

              {selectedApplication.experience && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300">الخبرة السابقة</label>
                  <p className="text-lg">{selectedApplication.experience}</p>
                </div>
              )}

              {selectedApplication.comments && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300">ملاحظات</label>
                  <p className="text-lg">{selectedApplication.comments}</p>
                </div>
              )}

              {selectedApplication.registrationType === 'Full' && (
                <div className="space-y-4 border-t border-white/20 pt-4">
                  <h3 className="text-xl font-bold">معلومات الدفع</h3>
                  {selectedApplication.paymentMethod && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300">طريقة الدفع</label>
                      <p className="text-lg">{selectedApplication.paymentMethod}</p>
                    </div>
                  )}
                  
                  {selectedApplication.paymentProofUrl && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">إثبات الدفع</label>
                      <img 
                        src={selectedApplication.paymentProofUrl} 
                        alt="Payment Proof" 
                        className="max-w-full h-auto rounded-lg border border-white/20"
                      />
                    </div>
                  )}

                  {(selectedApplication.idFrontUrl || selectedApplication.idBackUrl) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">صور الهوية</label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedApplication.idFrontUrl && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">الوجه الأمامي</p>
                            <img 
                              src={selectedApplication.idFrontUrl} 
                              alt="ID Front" 
                              className="max-w-full h-auto rounded-lg border border-white/20"
                            />
                          </div>
                        )}
                        {selectedApplication.idBackUrl && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">الوجه الخلفي</p>
                            <img 
                              src={selectedApplication.idBackUrl} 
                              alt="ID Back" 
                              className="max-w-full h-auto rounded-lg border border-white/20"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.signature && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">التوقيع</label>
                      <img 
                        src={selectedApplication.signature} 
                        alt="Signature" 
                        className="max-w-full h-auto rounded-lg border border-white/20 bg-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;