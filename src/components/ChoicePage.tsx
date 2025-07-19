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

const ChoicePage = ({ onChoiceSelect, onBack, showCourseTypes }: ChoicePageProps) => {
  const [showWorkshops, setShowWorkshops] = useState(false);
  const [showClubs, setShowClubs] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInternModal, setShowInternModal] = useState(false);
  const [showPaidOptions, setShowPaidOptions] = useState(false); // NEW
  const [showFullReg, setShowFullReg] = useState(false); // NEW
  const [showQuickReg, setShowQuickReg] = useState(false); // NEW
  const [showTheOfficeModal, setShowTheOfficeModal] = useState(false);

  const handleServiceSelect = (service: string) => {
    if (service === 'workshops') {
      setShowWorkshops(true);
    } else if (service === 'clubs') {
      setShowClubs(true);
    } else if (service === 'jobs') {
      setShowJobModal(true);
    } else if (service === 'internapplication') {
      setShowInternModal(true);
    } else if (service === 'courses') {
      setShowPaidOptions(true); // Show paid options modal/section
    } else {
      onChoiceSelect(service as any);
    }
  };

  return (
    <>
      {showCourseTypes ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-4"
          dir="rtl"
        >
          <div className="max-w-4xl w-full">
            {/* EXTREMELY PROMINENT Quick Access Card */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 40px 10px #22b0fc55', borderColor: '#22b0fc' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              onClick={() => onChoiceSelect('basic')}
              className="relative bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 text-white rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center border-4 border-blue-300 hover:border-[#22b0fc] transition-all duration-300 cursor-pointer mb-12 mx-auto w-full max-w-3xl min-h-[260px] overflow-hidden group"
              style={{ zIndex: 10 }}
            >
              {/* Animated Glow Border */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none animate-glow border-4 border-blue-300 group-hover:border-[#22b0fc]" style={{ boxShadow: '0 0 60px 10px #22b0fc33' }}></div>
              {/* Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
                <span className="bg-white/90 text-blue-700 font-bold px-5 py-1 rounded-full text-base shadow-lg border border-blue-200">موصى به</span>
              </div>
              <GraduationCap className="w-16 h-16 mb-4 text-white drop-shadow-xl animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">تسجيل سريع - دورة أولية</h2>
              <p className="text-lg md:text-2xl mb-3 font-semibold drop-shadow">أسرع طريقة لحجز مكانك في الدورة، فقط اضغط وابدأ!</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Star className="w-7 h-7 text-yellow-400 animate-spin-slow" />
                <span className="font-bold text-lg">بدون تعقيدات، بدون انتظار</span>
              </div>
            </motion.div>

            {/* Back Button */}
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="mb-6 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                العودة للخلف
              </motion.button>
            )}

            {/* Header */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative mb-8"
              >
                <div className="w-28 h-28 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#22b0fc] rounded-full animate-pulse shadow-2xl"></div>
                  <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <img 
                      src="/mainlogo.png" 
                      alt="Rising Academy Logo" 
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <GraduationCap className="w-14 h-14 text-[#22b0fc] hidden" />
                  </div>
                  {/* Floating sparkles */}
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      rotate: -360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1
                    }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <Star className="w-6 h-6 text-blue-400 drop-shadow-lg" />
                  </motion.div>
                </div>
              </motion.div>
              
              <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
                اختر نوع التسجيل في الدورات
              </h1>
              <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                اختر طريقة التسجيل التي تناسبك في الدورات المدفوعة
              </p>
            </motion.div>

            {/* Course Type Cards */}
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 30px 60px -12px rgba(34, 176, 252, 0.4)"
                }}
                className="group cursor-pointer"
                onClick={() => setShowQuickReg(true)}
              >
                <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-[#22b0fc]/30 transition-all duration-500 relative overflow-hidden border-2 border-gray-100 hover:border-[#22b0fc]/30 min-h-[500px] flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22b0fc]/8 to-cyan-500/8 group-hover:from-[#22b0fc]/15 group-hover:to-cyan-500/15 transition-all duration-500"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-5 group-hover:opacity-12 transition-opacity duration-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full"
                    >
                      <GraduationCap className="w-full h-full text-[#22b0fc]" />
                    </motion.div>
                  </div>
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <motion.div 
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className="w-20 h-20 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                    >
                      <GraduationCap className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-6">تسجيل أولي</h3>
                    <p className="text-gray-600 text-xl mb-8 leading-relaxed flex-1">
                      تسجيل كمرحلة اولى يحتاج منك التوجه الى المركز بعد التواصل
                    </p>
                    <ul className="space-y-4 text-gray-700 mb-8">
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-4 h-4 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-4 shadow-md"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors text-lg">حجز مكانك في الدورة</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-4 h-4 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-4 shadow-md"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors text-lg">معلومات تفصيلية عن المنهج</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-4 h-4 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-4 shadow-md"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors text-lg">إمكانية التواصل المباشر</span>
                      </li>
                    </ul>
                    
                    {/* Hover effect badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center px-4 py-2 bg-[#22b0fc]/15 text-[#22b0fc] text-base font-semibold rounded-full shadow-md"
                    >
                      <Sparkles className="w-5 h-5 ml-2" />
                      مجاني ومرن
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                  boxShadow: "0 30px 60px -12px rgba(16, 185, 129, 0.4)"
                }}
                className="group cursor-pointer"
                onClick={() => setShowFullReg(true)}
              >
                <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-green-500/30 transition-all duration-500 relative overflow-hidden border-2 border-gray-100 hover:border-green-500/30 min-h-[500px] flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 to-emerald-500/8 group-hover:from-green-500/15 group-hover:to-emerald-500/15 transition-all duration-500"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute top-0 left-0 w-40 h-40 opacity-5 group-hover:opacity-12 transition-opacity duration-500">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full"
                    >
                      <CreditCard className="w-full h-full text-green-500" />
                    </motion.div>
                  </div>
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <motion.div 
                      whileHover={{ rotate: -5, scale: 1.1 }}
                      className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                    >
                      <CreditCard className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-6">تسجيل كلي</h3>
                    <p className="text-gray-600 text-xl mb-8 leading-relaxed flex-1">
                      تسجيل كامل مع دفع اما مرة واحدة او جزئيا وضمان مكانك في الدورة
                    </p>
                    <ul className="space-y-4 text-gray-700 mb-8">
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full ml-4 shadow-md"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors text-lg">ضمان مكانك بنسبة 100%</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full ml-4 shadow-md"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors text-lg">امكانية التسجيل عن بعد كليا</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full ml-4 shadow-md"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors text-lg">متابعة مستمرة بعد الدورة</span>
                      </li>
                    </ul>
                    
                    {/* Hover effect badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center px-4 py-2 bg-green-500/15 text-green-600 text-base font-semibold rounded-full shadow-md"
                    >
                      <Star className="w-5 h-5 ml-2" />
                      الأكثر شمولية
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : showWorkshops ? (
        <WorkshopList onBack={() => setShowWorkshops(false)} />
      ) : showClubs ? (
        <ClubList onBack={() => setShowClubs(false)} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-4"
          dir="rtl"
        >
          <div className="max-w-6xl w-full">
            {/* Quick Access Button for Basic Registration */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#e0f2ff', borderColor: '#2563eb' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoiceSelect('basic')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center mx-auto"
              >
                <GraduationCap className="w-6 h-6 ml-3" />
                تسجيل سريع - دورة أولية
              </motion.button>
            </motion.div>

            {/* Logo and Header */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#22b0fc] rounded-full animate-pulse shadow-2xl"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <img 
                    src="/mainlogo.png" 
                    alt="Rising Academy Logo" 
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <GraduationCap className="w-16 h-16 text-[#22b0fc] hidden" />
                </div>
                
                {/* Floating elements around logo */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -top-4 -right-4"
                >
                  <Sparkles className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                  }}
                  className="absolute -bottom-4 -left-4"
                >
                  <Star className="w-6 h-6 text-blue-400 drop-shadow-lg" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1
                  }}
                  className="absolute top-0 -left-6"
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg"></div>
                </motion.div>
              </motion.div>
              
              <h1 className="text-5xl font-bold text-white mb-4">
                أكاديمية رايزين
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                اختر الخدمة التي تناسبك من خدماتنا المتنوعة
              </p>
            </motion.div>

            {/* Main Choice Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Paid Courses */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(34, 176, 252, 0.25)"
                }}
                className="group cursor-pointer"
                onClick={() => handleServiceSelect('courses')}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-500 relative overflow-hidden h-full border border-gray-100 hover:border-[#22b0fc]/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22b0fc]/5 to-cyan-500/5 group-hover:from-[#22b0fc]/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
                  
                  {/* Animated background pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full"
                    >
                      <GraduationCap className="w-full h-full text-[#22b0fc]" />
                    </motion.div>
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-16 h-16 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <GraduationCap className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">دورات مدفوعة</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      دورات تدريبية متخصصة في مختلف المجالات التقنية واللغوية
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors">دورات البرمجة والتكنولوجيا</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors">دورات اللغات الأجنبية</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-3 h-3 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-full ml-3 shadow-sm"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors">شهادات معتمدة</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Free Workshops */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                  boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)"
                }}
                className="group cursor-pointer"
                onClick={() => handleServiceSelect('workshops')}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 relative overflow-hidden h-full border border-gray-100 hover:border-yellow-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <motion.div 
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <Calendar className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">ورشات مجانية</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      ورش تدريبية مجانية أسبوعية لتطوير المهارات
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full ml-3 shadow-sm"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors">ورش أسبوعية مجانية</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full ml-3 shadow-sm"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors">مواضيع متنوعة ومفيدة</span>
                      </li>
                      <li className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full ml-3 shadow-sm"
                        ></motion.div>
                        <span className="group-hover:text-gray-800 transition-colors">شهادات حضور</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Club Membership */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => handleServiceSelect('clubs')}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">الانخراط في النوادي</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      انضم إلى نوادينا المتخصصة وطور مهاراتك مع المجتمع
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full ml-3"></div>
                        نوادي متخصصة متنوعة
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full ml-3"></div>
                        أنشطة جماعية ومشاريع
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full ml-3"></div>
                        تطوير المهارات الاجتماعية
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Job Applications */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: -5 }}
                className="group cursor-pointer"
                onClick={() => setShowJobModal(true)}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">التقديم على وظيفة</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      انضم إلى فريق العمل كمدرس أو موظف إداري
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                        وظائف تدريس متنوعة
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                        وظائف إدارية وتقنية
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                        بيئة عمل محفزة
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div> 

              {/* Internship Application */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => handleServiceSelect('internapplication')}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 group-hover:from-indigo-500/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">طلب تربص</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      قدم للتدريب واكتسب خبرة عملية معنا
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full ml-3"></div>
                        فرصة للتعلم الميداني
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full ml-3"></div>
                        إشراف مباشر من خبراء
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full ml-3"></div>
                        شهادة تدريب في نهاية الفترة
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* The Office Club Card */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
                onClick={() => setShowTheOfficeModal(true)}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-gray-500/25 transition-all duration-500 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-400/5 group-hover:from-gray-500/10 group-hover:to-gray-400/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a3 3 0 0 0-3 3v1H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V5a3 3 0 0 0-3-3zM9 6V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9zm3 4a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z"/>
                        <circle cx="12" cy="14" r="2"/>
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">The Office Club</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      انضم إلى نادي The Office وطور مهاراتك اللغوية
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                        فعاليات وأنشطة متنوعة
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                        تطوير اللغة الإنجليزية
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                        بيئة عمل تفاعلية
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Admin Button */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChoiceSelect('admin')}
                className="bg-gradient-to-r from-[#22b0fc] to-blue-600 hover:from-[#1a9de8] hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-300 flex items-center mx-auto"
              >
                <Shield className="w-6 h-6 ml-3" />
                الدخول للإدارة
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
      {/* Modals */}
      {showJobModal && (
        <JobApplicationModal onClose={() => setShowJobModal(false)} />
      )}
      {showInternModal && (
        <InternApplicationModal onClose={() => setShowInternModal(false)} />
      )}
      {/* Paid Registration Options Modal/Section */}
      {showPaidOptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setShowPaidOptions(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden" 
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-transparent rounded-full opacity-50"></div>
            
            <button 
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors" 
              onClick={() => setShowPaidOptions(false)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative z-10 text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <GraduationCap className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">اختر نوع التسجيل</h2>
              <p className="text-gray-600 text-lg">اختر الطريقة التي تناسبك للتسجيل في الدورات</p>
            </div>
            
            <div className="flex flex-col gap-6">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 rounded-2xl font-bold text-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-xl transition-all duration-300 relative overflow-hidden"
                onClick={() => {
                  setShowPaidOptions(false);
                  setShowFullReg(true); // Show full registration form
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 ml-3" />
                  تسجيل كلي
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 rounded-2xl font-bold text-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-xl transition-all duration-300 relative overflow-hidden"
                onClick={() => {
                  setShowPaidOptions(false);
                  setShowQuickReg(true); // Show quick registration form
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 ml-3" />
                  تسجيل أولي سريع
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Registration Modals (always rendered) */}
      {showFullReg && (
        <RegistrationForm 
          type="full" 
          onBack={() => {
            setShowFullReg(false);
            setShowPaidOptions(true); // Show the options again when going back
          }} 
        />
      )}
      {showQuickReg && (
        <RegistrationForm 
          type="basic" 
          onBack={() => {
            setShowQuickReg(false);
            setShowPaidOptions(true); // Show the options again when going back
          }}
        />
      )}
      {/* The Office Club Modal */}
      {showTheOfficeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setShowTheOfficeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()} 
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">التقديم لنادي The Office</h2>
              <button 
                onClick={() => setShowTheOfficeModal(false)} 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <TheOfficeForm 
              onClose={() => setShowTheOfficeModal(false)} 
              onSuccess={() => {
                setShowTheOfficeModal(false);
                // Navigate back to home page after successful submission
                window.location.reload();
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ChoicePage;