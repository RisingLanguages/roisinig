import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Check, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { COURSES, WILAYAS, EDUCATION_LEVELS, PAYMENT_METHODS } from '../data/constants';
import { Application } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

interface RegistrationFormProps {
  type: 'basic' | 'full';
  onBack: () => void;
}

const RegistrationForm = ({ type, onBack }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<Partial<Application>>({
    registrationType: type === 'full' ? 'Full' : 'Basic',
  });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const signatureRef = useRef<SignatureCanvas>(null);

  const professionalCourses = COURSES.filter(course => course.category === 'professional');
  const languageCourses = COURSES.filter(course => course.category === 'language');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file: File, filename: string): Promise<string> => {
    const storageRef = ref(storage, `applications/${Date.now()}_${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applicationData: Application = {
        ...formData,
        course: selectedCourse,
        submissionDate: new Date(),
      } as Application;

      // Handle file uploads for full registration
      if (type === 'full') {
        const idFrontInput = document.getElementById('idFront') as HTMLInputElement;
        const idBackInput = document.getElementById('idBack') as HTMLInputElement;
        const paymentProofInput = document.getElementById('paymentProof') as HTMLInputElement;

        if (idFrontInput?.files?.[0]) {
          applicationData.idFrontUrl = await handleFileUpload(idFrontInput.files[0], 'id_front');
        }
        if (idBackInput?.files?.[0]) {
          applicationData.idBackUrl = await handleFileUpload(idBackInput.files[0], 'id_back');
        }
        if (paymentProofInput?.files?.[0]) {
          applicationData.paymentProofUrl = await handleFileUpload(paymentProofInput.files[0], 'payment_proof');
        }

        // Add signature
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
          applicationData.signature = signatureRef.current.toDataURL();
        }
      }

      // Save to Firestore
      await addDoc(collection(db, 'applications'), applicationData);

      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ registrationType: type === 'full' ? 'Full' : 'Basic' });
        setSelectedCourse('');
        setSelectedPaymentMethod('');
        if (signatureRef.current) {
          signatureRef.current.clear();
        }
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-[#22b0fc] to-blue-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-[#22b0fc]/20 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-[#22b0fc] bg-clip-text text-transparent">
              RA
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Rising Academy</h1>
          <p className="text-blue-100 text-lg">
            {type === 'full' ? 'تسجيل كامل مع دفع مسبق' : 'تسجيل أولي مجاني'}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 ml-2" />
        العودة للخلف
      </motion.button>

      {/* Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                الاسم الكامل <span className="text-sm text-gray-300">Full Name</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300"
                placeholder="أدخل اسمك الكامل"
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                العمر <span className="text-sm text-gray-300">Age</span>
              </label>
              <input
                type="number"
                min="16"
                max="65"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300"
                placeholder="العمر"
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                رقم الهاتف <span className="text-sm text-gray-300">Phone</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300"
                placeholder="0555 123 456"
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                البريد الإلكتروني (اختياري) <span className="text-sm text-gray-300">Email</span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300"
                placeholder="example@email.com"
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                الولاية <span className="text-sm text-gray-300">Wilaya</span>
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300"
                onChange={(e) => handleInputChange('wilaya', e.target.value)}
              >
                <option value="">اختر الولاية</option>
                {WILAYAS.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.name} className="text-gray-900">
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                المستوى التعليمي <span className="text-sm text-gray-300">Education</span>
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300"
                onChange={(e) => handleInputChange('education', e.target.value)}
              >
                <option value="">اختر المستوى التعليمي</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level} className="text-gray-900">
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-white font-semibold mb-4">
              الدورة المطلوبة <span className="text-sm text-gray-300">Course Selection</span>
            </label>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">الدورات المهنية - Professional Courses</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {professionalCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        id={course.id}
                        name="course"
                        value={course.name}
                        checked={selectedCourse === course.name}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={course.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedCourse === course.name
                            ? 'bg-[#22b0fc] border-[#22b0fc] text-white shadow-lg'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="font-semibold">{course.name}</div>
                        <div className="text-sm opacity-80">{course.arabicName}</div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-3">دورات اللغات - Language Courses</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languageCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        id={course.id}
                        name="course"
                        value={course.name}
                        checked={selectedCourse === course.name}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={course.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedCourse === course.name
                            ? 'bg-purple-500 border-purple-400 text-white shadow-lg'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="font-semibold">{course.name}</div>
                        <div className="text-sm opacity-80">{course.arabicName}</div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                الخبرة السابقة (اختياري) <span className="text-sm text-gray-300">Experience</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300 resize-none"
                placeholder="اكتب عن خبرتك السابقة..."
                onChange={(e) => handleInputChange('experience', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                ملاحظات أو استفسارات (اختياري) <span className="text-sm text-gray-300">Comments</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#22b0fc] transition-all duration-300 resize-none"
                placeholder="أي استفسارات أو ملاحظات؟"
                onChange={(e) => handleInputChange('comments', e.target.value)}
              />
            </div>
          </div>

          {/* Full Registration Additional Fields */}
          {type === 'full' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="space-y-6 border-t border-white/20 pt-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">معلومات إضافية للتسجيل الكامل</h3>
              
              {/* ID Photos */}
              <div>
                <label className="block text-white font-semibold mb-4">
                  صور بطاقة الهوية <span className="text-sm text-gray-300">ID Card Photos</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">الوجه الأمامي</label>
                    <input
                      type="file"
                      id="idFront"
                      accept="image/*"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#22b0fc] file:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">الوجه الخلفي</label>
                    <input
                      type="file"
                      id="idBack"
                      accept="image/*"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#22b0fc] file:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-white font-semibold mb-4">
                  طريقة الدفع <span className="text-sm text-gray-300">Payment Method</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.name}
                        checked={selectedPaymentMethod === method.name}
                        onChange={(e) => {
                          setSelectedPaymentMethod(e.target.value);
                          handleInputChange('paymentMethod', e.target.value);
                        }}
                        className="sr-only"
                        required
                      />
                      <label
                        htmlFor={method.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          selectedPaymentMethod === method.name
                            ? 'bg-green-500 border-green-400 text-white shadow-lg'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="font-semibold">{method.name}</div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Payment Proof */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  إثبات الدفع <span className="text-sm text-gray-300">Payment Proof</span>
                </label>
                <input
                  type="file"
                  id="paymentProof"
                  accept="image/*"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white"
                />
              </div>

              {/* Signature */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  التوقيع <span className="text-sm text-gray-300">Signature</span>
                </label>
                <div className="bg-white rounded-xl p-4">
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className: 'w-full h-32 border border-gray-300 rounded-lg',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => signatureRef.current?.clear()}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    مسح التوقيع
                  </button>
                </div>
              </div>

              {/* Agreement */}
              <div className="bg-white/10 rounded-xl p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-5 h-5 text-[#22b0fc] border-gray-300 rounded focus:ring-[#22b0fc]"
                    onChange={(e) => handleInputChange('agreedToContract', e.target.checked)}
                  />
                  <span className="text-white text-sm">
                    أوافق على شروط وأحكام الأكاديمية وسياسة الاسترداد
                    <span className="block text-gray-300 mt-1">
                      I agree to the academy's terms and conditions and refund policy
                    </span>
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !selectedCourse}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isSubmitting || !selectedCourse
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/25'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                جاري الإرسال...
              </div>
            ) : (
              'إرسال التسجيل'
            )}
          </motion.button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500 text-white p-4 rounded-xl flex items-center"
            >
              <Check className="w-6 h-6 mr-3" />
              تم إرسال التسجيل بنجاح! سنتواصل معك قريباً.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500 text-white p-4 rounded-xl flex items-center"
            >
              <X className="w-6 h-6 mr-3" />
              حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;
