import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, User, Check, GraduationCap } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { InternApplication } from '../types';
import SignatureCanvas from 'react-signature-canvas';

interface InternApplicationModalProps {
  onClose: () => void;
}

const InternApplicationModal = ({ onClose }: InternApplicationModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    wilaya: '',
    major: '',
    department: '',
    startDate: '',
    skills: '',
    projects: '',
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureError, setSignatureError] = useState(false);

  const departments = [
    'تطوير الويب',
    'تطوير التطبيقات',
    'التصميم الجرافيكي',
    'التسويق الرقمي',
    'إدارة المحتوى',
    'خدمة العملاء',
    'الموارد البشرية',
    'المحاسبة',
    'أخرى'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (signatureRef.current && signatureRef.current.isEmpty()) {
      setSignatureError(true);
      setIsSubmitting(false);
      return;
    }
    setSignatureError(false);

    try {
      const applicationData: Omit<InternApplication, 'id'> = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        wilaya: formData.wilaya,
        major: formData.major,
        department: formData.department,
        startDate: formData.startDate,
        skills: formData.skills,
        projects: formData.projects,
        motivation: formData.motivation,
        applicationDate: new Date(),
        status: 'pending',
        signature: signatureRef.current?.getTrimmedCanvas().toDataURL() || ''
      };

      await addDoc(collection(db, 'internApplications'), applicationData);

      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          fullName: '', age: '', phone: '', email: '', wilaya: '',
          major: '', department: '', startDate: '', skills: '', projects: '', motivation: ''
        });
        setSubmitStatus(null);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting intern application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">طلب تدريب</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header Info */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                برنامج التدريب في أكاديمية رايزين
              </h3>
              <p className="text-gray-600 text-sm">
                اكتسب خبرة عملية قيمة واطور مهاراتك مع فريقنا المتخصص
              </p>
            </div>
          </div>
        </div>

        {submitStatus === 'success' ? (
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
              تم تقديم طلب التدريب بنجاح. سنتواصل معك قريباً لمتابعة الإجراءات.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
            >
              <p className="text-green-700 text-sm">
                ✓ تم استلام طلب التدريب<br/>
                ✓ سيتم مراجعة الطلب خلال 72 ساعة<br/>
                ✓ ستصلك رسالة بموعد المقابلة
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">المعلومات الشخصية</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    العمر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="30"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="العمر"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="0555 123 456"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">
                  الولاية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.wilaya}
                  onChange={(e) => setFormData(prev => ({ ...prev, wilaya: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="اسم الولاية"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">المعلومات الأكاديمية</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    التخصص <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="التخصص الأكاديمي"
                  />
                </div>
              </div>
            </div>

            {/* Internship Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">تفاصيل التدريب</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    القسم المطلوب <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    تاريخ البدء المفضل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Skills and Experience */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">المهارات والخبرة</h3>
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  المهارات التقنية <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اذكر مهاراتك التقنية والبرمجية..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">
                  المشاريع السابقة (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={formData.projects}
                  onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اكتب عن المشاريع التي عملت عليها..."
                />
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الدافع للتدريب <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="اكتب لماذا ترغب في هذا التدريب..."
              />
            </div>

            {/* Signature */}
            <div className="mt-6">
              <label className="block text-gray-800 font-semibold mb-2">
                التوقيع <span className="text-red-500">*</span>
              </label>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{ className: 'w-full h-32 border border-gray-300 rounded-lg' }}
                />
                <button
                  type="button"
                  onClick={() => signatureRef.current?.clear()}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  مسح التوقيع
                </button>
                {signatureError && (
                  <div className="text-red-600 mt-2 text-sm">يرجى توقيع الطلب قبل الإرسال.</div>
                )}
              </div>
            </div>

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-center"
              >
                حدث خطأ أثناء التقديم. يرجى المحاولة مرة أخرى.
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
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg hover:shadow-indigo-500/25'
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
                    جاري التقديم...
                  </div>
                ) : (
                  'تقديم الطلب'
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default InternApplicationModal;