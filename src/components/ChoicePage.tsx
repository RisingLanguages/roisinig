import { motion } from 'framer-motion';
import { GraduationCap, CreditCard, Shield } from 'lucide-react';

interface ChoicePageProps {
  onChoiceSelect: (type: 'basic' | 'full' | 'admin') => void;
}

const ChoicePage = ({ onChoiceSelect }: ChoicePageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full">
        {/* Logo and Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#22b0fc] rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-16 h-16 text-[#22b0fc]" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-[#22b0fc] to-blue-800 bg-clip-text text-transparent mb-4">
            اختر نوع التسجيل
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            اختر طريقة التسجيل التي تناسبك في أكاديمية رايزين للتسجيل والاستشارات
          </p>
        </motion.div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('basic')}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22b0fc]/10 to-cyan-500/10 group-hover:from-[#22b0fc]/20 group-hover:to-cyan-500/20 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-[#22b0fc] to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">تسجيل أولي</h3>
                <p className="text-blue-100 text-lg mb-6">
                تسجيل كمرحلة اولى يحتاج منك التوجه الى المركز بعد التواصل
                </p>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#22b0fc] rounded-full mr-3"></div>
                    حجز مكانك في الدورة
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#22b0fc] rounded-full mr-3"></div>
                    معلومات تفصيلية عن المنهج
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#22b0fc] rounded-full mr-3"></div>
                    إمكانية التواصل المباشر
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            className="group cursor-pointer"
            onClick={() => onChoiceSelect('full')}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">تسجيل كلي</h3>
                <p className="text-green-100 text-lg mb-6">
                  تسجيل كامل مع دفع اما مرة واحدة او جزئيا وضمان مكانك في الدورة
                </p>
                <ul className="space-y-2 text-green-100">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    ضمان مكانك بنسبة 100%
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    امكانية التسجيل عن بعد بدون الحاجة الى التوجه لمركز الاكاديمية
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    متابعة مستمرة بعد الدورة
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
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChoiceSelect('admin')}
            className="bg-gradient-to-r from-[#22b0fc] to-blue-600 hover:from-[#1a9de8] hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[#22b0fc]/25 transition-all duration-300 flex items-center mx-auto"
          >
            <Shield className="w-6 h-6 mr-3" />
            الدخول للإدارة
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChoicePage;
