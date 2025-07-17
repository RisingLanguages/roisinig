import { useState } from 'react';
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
      {submitStatus === 'success' && <div className="text-green-600 text-center mt-2">تم إرسال الطلب بنجاح!</div>}
      {submitStatus === 'error' && <div className="text-red-600 text-center mt-2">حدث خطأ أثناء الإرسال. حاول مرة أخرى.</div>}
    </form>
  );
};

export default TheOfficeForm; 