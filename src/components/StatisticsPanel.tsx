import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Award, 
  Briefcase, 
  GraduationCap,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Application, WorkshopApplication, ClubApplication, JobApplication, InternApplication } from '../types';

const StatisticsPanel = () => {
  const [courseApplications, setCourseApplications] = useState<Application[]>([]);
  const [workshopApplications, setWorkshopApplications] = useState<WorkshopApplication[]>([]);
  const [clubApplications, setClubApplications] = useState<ClubApplication[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [internApplications, setInternApplications] = useState<InternApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Course applications
    const courseQuery = query(collection(db, 'applications'));
    unsubscribes.push(onSnapshot(courseQuery, (snapshot) => {
      const apps: Application[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          submissionDate: data.submissionDate?.toDate()
        } as Application);
      });
      setCourseApplications(apps);
    }));

    // Workshop applications
    const workshopQuery = query(collection(db, 'workshopApplications'));
    unsubscribes.push(onSnapshot(workshopQuery, (snapshot) => {
      const apps: WorkshopApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate()
        } as WorkshopApplication);
      });
      setWorkshopApplications(apps);
    }));

    // Club applications
    const clubQuery = query(collection(db, 'clubApplications'));
    unsubscribes.push(onSnapshot(clubQuery, (snapshot) => {
      const apps: ClubApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate()
        } as ClubApplication);
      });
      setClubApplications(apps);
    }));

    // Job applications
    const jobQuery = query(collection(db, 'jobApplications'));
    unsubscribes.push(onSnapshot(jobQuery, (snapshot) => {
      const apps: JobApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate()
        } as JobApplication);
      });
      setJobApplications(apps);
    }));

    // Intern applications
    const internQuery = query(collection(db, 'internApplications'));
    unsubscribes.push(onSnapshot(internQuery, (snapshot) => {
      const apps: InternApplication[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        apps.push({ 
          id: doc.id, 
          ...data,
          applicationDate: data.applicationDate?.toDate()
        } as InternApplication);
      });
      setInternApplications(apps);
      setLoading(false);
    }));

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const getThisMonthCount = (applications: any[]) => {
    const now = new Date();
    return applications.filter(app => {
      const appDate = app.submissionDate || app.applicationDate;
      if (!appDate) return false;
      return appDate.getMonth() === now.getMonth() && 
             appDate.getFullYear() === now.getFullYear();
    }).length;
  };

  const getStatusCount = (applications: any[], status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  const totalApplications = courseApplications.length + workshopApplications.length + 
                           clubApplications.length + jobApplications.length + internApplications.length;

  const stats = [
    {
      title: 'إجمالي الطلبات',
      value: totalApplications,
      icon: Users,
      color: 'bg-[#22b0fc]',
      change: '+12%'
    },
    {
      title: 'طلبات الدورات',
      value: courseApplications.length,
      icon: GraduationCap,
      color: 'bg-blue-500',
      change: '+8%'
    },
    {
      title: 'طلبات الورش',
      value: workshopApplications.length,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'طلبات النوادي',
      value: clubApplications.length,
      icon: Award,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'طلبات التوظيف',
      value: jobApplications.length,
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+20%'
    },
    {
      title: 'طلبات التدريب',
      value: internApplications.length,
      icon: Users,
      color: 'bg-indigo-500',
      change: '+10%'
    }
  ];

  const monthlyStats = [
    {
      title: 'طلبات الدورات هذا الشهر',
      value: getThisMonthCount(courseApplications),
      total: courseApplications.length
    },
    {
      title: 'طلبات الورش هذا الشهر',
      value: getThisMonthCount(workshopApplications),
      total: workshopApplications.length
    },
    {
      title: 'طلبات النوادي هذا الشهر',
      value: getThisMonthCount(clubApplications),
      total: clubApplications.length
    },
    {
      title: 'طلبات التوظيف هذا الشهر',
      value: getThisMonthCount(jobApplications),
      total: jobApplications.length
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22b0fc] mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">الإحصائيات العامة</h2>
        <p className="text-gray-600 mt-1">نظرة شاملة على جميع الطلبات والتسجيلات</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-90 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 ml-1" />
                  <span className="opacity-90">{stat.change} من الشهر الماضي</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Monthly Statistics */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-[#22b0fc] ml-3" />
          <h3 className="text-xl font-bold text-gray-800">إحصائيات الشهر الحالي</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monthlyStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <h4 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h4>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500">من {stat.total}</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#22b0fc] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stat.total > 0 ? (stat.value / stat.total) * 100 : 0}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Applications Status */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-blue-500 ml-2" />
            <h3 className="text-lg font-bold text-gray-800">حالة طلبات الدورات</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">قيد المراجعة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold">{getStatusCount(courseApplications, 'pending')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مقبولة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold">{getStatusCount(courseApplications, 'approved')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مرفوضة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold">{getStatusCount(courseApplications, 'rejected')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Applications Status */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-yellow-500 ml-2" />
            <h3 className="text-lg font-bold text-gray-800">حالة طلبات الورش</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">قيد المراجعة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold">{getStatusCount(workshopApplications, 'pending')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مقبولة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold">{getStatusCount(workshopApplications, 'approved')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مرفوضة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold">{getStatusCount(workshopApplications, 'rejected')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص النشاط الأخير</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {courseApplications.filter(app => {
                const date = app.submissionDate;
                return date && (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <div className="text-sm text-gray-600">طلبات دورات اليوم</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {workshopApplications.filter(app => {
                const date = app.applicationDate;
                return date && (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <div className="text-sm text-gray-600">تسجيلات ورش اليوم</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {clubApplications.filter(app => {
                const date = app.applicationDate;
                return date && (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <div className="text-sm text-gray-600">طلبات نوادي اليوم</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {jobApplications.filter(app => {
                const date = app.applicationDate;
                return date && (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <div className="text-sm text-gray-600">طلبات توظيف اليوم</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;