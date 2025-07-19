import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface TheOfficeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const TheOfficeForm = ({ onClose, onSuccess }: TheOfficeFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    englishLevel: '',
    email: '',
    preferredSession: '',
    attendanceConfirmation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'clubApplications'), {
        clubName: 'The Office',
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        englishLevel: formData.englishLevel,
        email: formData.email,
        preferredSession: formData.preferredSession,
        attendanceConfirmation: formData.attendanceConfirmation,
        applicationDate: new Date(),
        status: 'pending'
      });
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        setSubmitStatus(null);
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          تم التقديم بنجاح!
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg"
        >
          تم تقديم طلبك لنادي The Office بنجاح. سنتواصل معك قريباً.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
        >
          <p className="text-green-700 text-sm">
            ✓ تم استلام طلبك للنادي<br/>
            ✓ سيتم مراجعة الطلب خلال 24 ساعة<br/>
            ✓ ستصلك دعوة للانضمام قريباً
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 0-3 3v1H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V5a3 3 0 0 0-3-3zM9 6V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9zm3 4a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z"/>
              <circle cx="12" cy="14" r="2"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              انضم إلى نادي The Office
            </h3>
            <p className="text-gray-600 text-sm">
              نادي متخصص في تطوير مهارات اللغة الإنجليزية والتواصل
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            العمر <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="16"
            max="65"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="العمر"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="0555 123 456"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            البريد الإلكتروني (اختياري)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold mb-2">
          مستوى اللغة الإنجليزية <span className="text-red-500">*</span>
        </label>
        <select
          name="englishLevel"
          value={formData.englishLevel}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">اختر مستوى اللغة</option>
          <option value="مبتدئ">مبتدئ - لا أتحدث الإنجليزية</option>
          <option value="أساسي">أساسي - أعرف كلمات بسيطة</option>
          <option value="متوسط">متوسط - أستطيع التحدث بشكل بسيط</option>
          <option value="متوسط متقدم">متوسط متقدم - أتحدث بطلاقة نسبية</option>
          <option value="متقدم">متقدم - أتحدث بطلاقة عالية</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold mb-2">
          أي حصة تريد الحضور <span className="text-red-500">*</span>
        </label>
        <select
          name="preferredSession"
          value={formData.preferredSession}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">اختر الحصة المفضلة</option>
          <option value="سبت">السبت</option>
          <option value="اثنين">الاثنين</option>
          <option value="كلاهما">كلا اليومين</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold mb-2">
          تأكيد حضورك - هل متأكد من حضورك؟ <span className="text-red-500">*</span>
        </label>
        <select
          name="attendanceConfirmation"
          value={formData.attendanceConfirmation}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">اختر إجابتك</option>
          <option value="نعم متأكد">نعم، متأكد من الحضور</option>
          <option value="غير متأكد">غير متأكد، سأحاول الحضور</option>
          <option value="ربما">ربما، حسب الظروف</option>
        </select>
      </div>

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-center"
        >
          حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
        </motion.div>
      )}

      <div className="flex gap-3 pt-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
            isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25'
          } text-white`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
              جاري الإرسال...
            </div>
          ) : (
            'إرسال الطلب'
          )}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium"
        >
          إلغاء
        </motion.button>
      </div>
    </form>
  );
};

export default TheOfficeForm;