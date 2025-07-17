import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Users, MapPin, User } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Workshop } from '../types';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import WorkshopApplicationModal from './WorkshopApplicationModal';

interface WorkshopListProps {
  onBack: () => void;
}

const WorkshopList = ({ onBack }: WorkshopListProps) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'workshops'),
      where('isActive', '==', true),
      orderBy('date', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workshopsData: Workshop[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workshopsData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate()
        } as Workshop);
      });
      setWorkshops(workshopsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل الورش...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Calendar className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">الورش المجانية</h1>
          <p className="text-orange-100 text-lg">
            ورش تدريبية مجانية أسبوعية لتطوير مهاراتك
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

      {/* Workshops Grid */}
      {workshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop, index) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedWorkshop(workshop)}
            >
              <div className="relative mb-4">
                <img
                  src={workshop.imageUrl}
                  alt={workshop.title}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  مجاني
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{workshop.title}</h3>
              <p className="text-white/80 text-sm mb-4 line-clamp-2">{workshop.description}</p>

              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center">
                  <Calendar size={16} className="ml-2" />
                  {new Date(workshop.date).toLocaleDateString('ar-SA')}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="ml-2" />
                  {workshop.time} - {workshop.duration} دقيقة
                </div>
                <div className="flex items-center">
                  <User size={16} className="ml-2" />
                  المدرب: {workshop.instructor}
                </div>
                <div className="flex items-center">
                  <Users size={16} className="ml-2" />
                  {workshop.currentParticipants}/{workshop.maxParticipants} مشارك
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWorkshop(workshop);
                }}
              >
                التسجيل في الورشة
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-white/50" />
          <h3 className="text-lg font-medium text-white mb-2">لا توجد ورش متاحة حالياً</h3>
          <p className="text-white/70">سيتم إضافة ورش جديدة قريباً</p>
        </div>
      )}

      {/* Workshop Application Modal */}
      {selectedWorkshop && (
        <WorkshopApplicationModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </motion.div>
  );
};

export default WorkshopList;