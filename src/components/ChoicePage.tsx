import { motion } from 'framer-motion';
import { GraduationCap, CreditCard, Calendar, Users, Briefcase, Shield, ArrowLeft, UserPlus, Sparkles, Star, X } from 'lucide-react';
import { useState } from 'react';
import WorkshopList from './WorkshopList';
import ClubList from './ClubList';
import JobApplicationModal from './JobApplicationModal';
import InternApplicationModal from './InternApplicationModal';
import RegistrationForm from './RegistrationForm';
import { collection, addDoc } from 'firebase/firestore';
import TheOfficeForm from './TheOfficeForm';
import { db } from '../firebase/config';

interface ChoicePageProps {
  onChoiceSelect: (type: 'internapplication' | 'courses' | 'workshops' | 'clubs' | 'jobs' | 'admin' | 'basic' | 'full') => void;
  onBack?: () => void;
  showCourseTypes?: boolean;
}

const choices = [
  {
    key: 'courses',
    title: 'الدورات المدفوعة',
    icon: <CreditCard className="w-8 h-8 text-blue-500" />,
    desc: 'سجّل في الدورات الاحترافية وطور مهاراتك مع نخبة المدربين.'
  },
  {
    key: 'workshops',
    title: 'ورش العمل المجانية',
    icon: <Calendar className="w-8 h-8 text-green-500" />,
    desc: 'شارك في ورش العمل المجانية واكتسب خبرة عملية مباشرة.'
  },
  {
    key: 'clubs',
    title: 'النوادي الطلابية',
    icon: <Users className="w-8 h-8 text-purple-500" />,
    desc: 'انضم إلى أحد النوادي وكن جزءًا من مجتمع نشط ومبدع.'
  },
  {
    key: 'jobs',
    title: 'فرص التوظيف',
    icon: <Briefcase className="w-8 h-8 text-yellow-500" />,
    desc: 'قدّم على فرص العمل المتاحة وابدأ مسيرتك المهنية.'
  },
  {
    key: 'internapplication',
    title: 'تدريب أكاديمي',
    icon: <GraduationCap className="w-8 h-8 text-indigo-500" />,
    desc: 'سجّل في برنامج التدريب الأكاديمي واكتسب خبرة عملية.'
  },
  {
    key: 'admin',
    title: 'دخول الإدارة',
    icon: <Shield className="w-8 h-8 text-red-500" />,
    desc: 'دخول لوحة تحكم الإدارة للمسؤولين فقط.'
  }
];

const ChoicePage = ({ onChoiceSelect, onBack, showCourseTypes }: ChoicePageProps) => {
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [showClubs, setShowClubs] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInternModal, setShowInternModal] = useState(false);
  const [showPaidOptions, setShowPaidOptions] = useState(false);
  const [showFullReg, setShowFullReg] = useState(false);
  const [showQuickReg, setShowQuickReg] = useState(false);
  const [showTheOfficeModal, setShowTheOfficeModal] = useState(false);

  // Modern hero section with logo and tagline
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-[#22b0fc] to-indigo-900 relative overflow-hidden px-2 py-6">
      {/* Sparkles and floating elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-full flex justify-center mt-8 z-10"
      >
        <Sparkles className="w-12 h-12 text-yellow-300 opacity-60 animate-spin-slow" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center mb-10 z-20"
      >
        <div className="bg-white/30 backdrop-blur-lg rounded-full p-4 shadow-xl mb-4">
          <img src="/mainlogo.png" alt="Rising Academy Logo" className="w-20 h-20 object-contain" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2 text-center">أهلاً بك في أكاديمية رايزينج</h1>
        <p className="text-xl md:text-2xl text-white/80 mb-2 text-center">ابدأ رحلتك التعليمية أو المهنية بخطوة واحدة</p>
      </motion.div>

      {/* Animated choices grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
        className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-20"
      >
        {choices.map((choice, idx) => (
          <motion.button
            key={choice.key}
            whileHover={{ scale: 1.04, y: -4, boxShadow: '0 8px 32px 0 rgba(34,176,252,0.15)' }}
            whileTap={{ scale: 0.98 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={() => {
              if (choice.key === 'workshops') setShowWorkshops(true);
              else if (choice.key === 'clubs') setShowClubs(true);
              else if (choice.key === 'jobs') setShowJobModal(true);
              else if (choice.key === 'internapplication') setShowInternModal(true);
              else if (choice.key === 'courses') setShowPaidOptions(true);
              else if (choice.key === 'admin') onChoiceSelect('admin');
              else onChoiceSelect(choice.key as any);
            }}
            className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center border border-white/30 hover:border-[#22b0fc] transition-all duration-300 cursor-pointer min-h-[260px]"
          >
            <div className="mb-4">{choice.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{choice.title}</h2>
            <p className="text-gray-600 text-base mb-2 flex-1">{choice.desc}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Modals and lists */}
      {showWorkshops && (
        <WorkshopList onClose={() => setShowWorkshops(false)} />
      )}
      {showClubs && (
        <ClubList onClose={() => setShowClubs(false)} />
      )}
      {showJobModal && (
        <JobApplicationModal onClose={() => setShowJobModal(false)} />
      )}
      {showInternModal && (
        <InternApplicationModal onClose={() => setShowInternModal(false)} />
      )}
      {showPaidOptions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPaidOptions(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowPaidOptions(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">اختر نوع التسجيل في الدورات</h2>
            <div className="flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowPaidOptions(false); onChoiceSelect('basic'); }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                تسجيل سريع - دورة أولية
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowPaidOptions(false); onChoiceSelect('full'); }}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all"
              >
                تسجيل كامل - دورة احترافية
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ChoicePage;