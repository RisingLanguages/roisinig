import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Check, Download } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { JobApplication } from '../types';
import SignatureCanvas from 'react-signature-canvas';

interface JobApplicationModalProps {
  onClose: () => void;
}

const JobApplicationModal = ({ onClose }: JobApplicationModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    wilaya: '',
    education: '',
    position: '',
    experience: '',
    skills: '',
    motivation: '',
    language: '',
    cvBase64: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureError, setSignatureError] = useState(false);
  const [cvError, setCvError] = useState('');

  const positions = [
    'مدرس برمجة', 
    'مدرس لغات',
    'مدرس تصميم جرافيكي',
    'مدرس تسويق رقمي',
    'موظف استقبال',
    'منسق أكاديمي',
    'مطور ويب',
    'مصمم جرافيكي',
    'مسؤول تسويق',
    'محاسب',
    'أخرى'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setCvError('الملف أكبر من 1 ميغابايت. يرجى اختيار ملف أصغر.');
        setFormData(prev => ({ ...prev, cvBase64: '' }));
        return;
      }
      setCvError('');
      const reader = new FileReader();
      reader.onload = function(evt) {
        setFormData(prev => ({ ...prev, cvBase64: evt.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (signatureRef.current && signatureRef.current.isEmpty()) {
      setSignatureError(true);
      setIsSubmitting(false);
      return;
    }
    setSignatureError(false);

    if (formData.position === 'مدرس لغات' && !formData.language) {
      setIsSubmitting(false);
      alert('يرجى تحديد اللغة التي تدرسها');
      return;
    }

    try {
      let position = formData.position;
      if (position === 'مدرس لغات' && formData.language) {
        position += ` (${formData.language})`;
      }
      
      const applicationData: Omit<JobApplication, 'id'> & { cvBase64?: string } = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email || '',
        wilaya: formData.wilaya,
        education: formData.education,
        position,
        experience: formData.experience,
        skills: formData.skills,
        motivation: formData.motivation,
        applicationDate: new Date(),
        status: 'pending',
        ...(formData.cvBase64 ? { cvBase64: formData.cvBase64 } : {})
      };

      await addDoc(collection(db, 'jobApplications'), applicationData);
      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          fullName: '', age: '', phone: '', email: '', wilaya: '',
          education: '', position: '', experience: '', skills: '',
          motivation: '', language: '', cvBase64: ''
        });
        setSubmitStatus(null);
        // Navigate back to home page after successful submission
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error submitting job application:', error);
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
          <h2 className="text-2xl font-bold text-gray-800">التقديم على وظيفة</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header Info */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                انضم إلى فريق أكاديمية رايزين
              </h3>
              <p className="text-gray-600 text-sm">
                نبحث عن المواهب المتميزة للانضمام إلى فريقنا التعليمي والإداري
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
              تم تقديم طلب التوظيف بنجاح. سنتواصل معك قريباً لمتابعة الإجراءات.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
            >
              <p className="text-green-700 text-sm">
                ✓ تم حفظ بياناتك بنجاح<br/>
                ✓ سيتم مراجعة طلبك خلال 48 ساعة<br/>
                ✓ ستصلك رسالة تأكيد قريباً
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
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="0555 123 456"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    الولاية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData(prev => ({ ...prev, wilaya: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="اسم الولاية"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    المستوى التعليمي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="المستوى التعليمي"
                  />
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات الوظيفة</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    المنصب <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={e => setFormData(prev => ({ ...prev, position: e.target.value, language: '' }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">اختر المنصب</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                {/* If position is مدرس لغات, show language input */}
                {formData.position === 'مدرس لغات' && (
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">
                      اللغة التي تدرسها <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.language}
                      onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="مثال: إنجليزية، فرنسية، ألمانية ..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Experience and Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">الخبرة والمهارات</h3>
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  الخبرة المهنية <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اكتب عن خبرتك المهنية والوظائف السابقة..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">
                  المهارات <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="اذكر مهاراتك التقنية والشخصية..."
                />
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                رفع السيرة الذاتية (PDF، DOC، DOCX) (اختياري)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white"
              />
              <div className="text-xs text-gray-500 mt-1">الحد الأقصى للحجم: 1 ميغابايت. سيتم حفظ الملف مباشرة في قاعدة البيانات.</div>
              {cvError && (
                <div className="text-red-600 text-xs mt-1">{cvError}</div>
              )}
              {formData.cvBase64 && !cvError && (
                <div className="text-green-600 text-xs mt-1">تم تحميل الملف بنجاح.</div>
              )}
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                لماذا تريد العمل معنا؟ <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="اكتب عن دوافعك للعمل مع أكاديمية رايزين..."
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
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25'
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

export default JobApplicationModal;