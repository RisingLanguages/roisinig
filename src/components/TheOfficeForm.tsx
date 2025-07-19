import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const TheOfficeForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    number: '',
    englishLevel: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        age: formData.age,
        phone: formData.number,
        englishLevel: formData.englishLevel,
        email: formData.email,
        applicationDate: new Date(),
        status: 'pending'
      });
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus(null);
        onClose();
      }, 2000);
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">الاسم الكامل *</label>
        <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">العمر *</label>
        <input name="age" value={formData.age} onChange={handleChange} required type="number" className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">رقم الهاتف *</label>
        <input name="number" value={formData.number} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">مستوى اللغة الإنجليزية *</label>
        <input name="englishLevel" value={formData.englishLevel} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-medium">البريد الإلكتروني (اختياري)</label>
        <input name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-gray-700 to-gray-400 text-white mt-4">
        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
      </button>
      {submitStatus === 'error' && <div className="text-red-600 text-center mt-2">حدث خطأ أثناء الإرسال. حاول مرة أخرى.</div>}
    </form>
  );
};

import { Check } from 'lucide-react';

export default TheOfficeForm; 