import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Check, Clock, Users } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Workshop, WorkshopApplication } from '../types';

interface WorkshopApplicationModalProps {
  workshop: Workshop;
  onClose: () => void;
}

const WorkshopApplicationModal = ({ workshop, onClose }: WorkshopApplicationModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    wilaya: '',
    education: '',
    experience: '',
    expectations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const applicationData: Omit<WorkshopApplication, 'id'> = {
        workshopId: workshop.id!,
        workshopTitle: workshop.title,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        wilaya: formData.wilaya,
        education: formData.education,
        experience: formData.experience,
        expectations: formData.expectations,
        applicationDate: new Date(),
        status: 'pending'
      };

      await addDoc(collection(db, 'workshopApplications'), applicationData);

      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          fullName: '', age: '', phone: '', email: '', wilaya: '',
          education: '', experience: '', expectations: ''
        });
        setSubmitStatus(null);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting workshop application:', error);
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
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">التسجيل في الورشة</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workshop Info */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={workshop.imageUrl}
              alt={workshop.title}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {workshop.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{workshop.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="ml-1" />
                  {new Date(workshop.date).toLocaleDateString('ar-SA')}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="ml-1" />
                  {workshop.duration} دقيقة
                </div>
                <div className="flex items-center">
                  <Users size={16} className="ml-1" />
                  {workshop.maxParticipants} مشارك
                </div>
              </div>
            </div>
          </div>
        </div>

        {submitStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تم التسجيل بنجاح!</h3>
            <p className="text-gray-600">
              تم تسجيلك في الورشة بنجاح. سنتواصل معك قريباً بتفاصيل الحضور.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
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
                  min="16"
                  max="65"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
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
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  الولاية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.wilaya}
                  onChange={(e) => setFormData(prev => ({ ...prev, wilaya: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  placeholder="المستوى التعليمي"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                الخبرة السابقة (اختياري)
              </label>
              <textarea
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="اكتب عن خبرتك السابقة في هذا المجال..."
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                توقعاتك من الورشة (اختياري)
              </label>
              <textarea
                rows={3}
                value={formData.expectations}
                onChange={(e) => setFormData(prev => ({ ...prev, expectations: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="ماذا تتوقع أن تتعلم من هذه الورشة؟"
              />
            </div>

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-center"
              >
                حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.
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
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-yellow-500/25'
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
                    جاري التسجيل...
                  </div>
                ) : (
                  'تسجيل في الورشة'
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

export default WorkshopApplicationModal;