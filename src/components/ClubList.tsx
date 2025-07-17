import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Settings, Award } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Club } from '../types';
import ClubApplicationModal from './ClubApplicationModal';

interface ClubListProps {
  onBack: () => void;
}

const ClubList = ({ onBack }: ClubListProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'clubs'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clubsData: Club[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        clubsData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate()
        } as Club);
      });
      setClubs(clubsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>جاري تحميل النوادي...</p>
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Users className="w-10 h-10 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">النوادي المتاحة</h1>
          <p className="text-purple-100 text-lg">
            انضم إلى نوادينا المتخصصة وطور مهاراتك مع المجتمع
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

      {/* Clubs Grid */}
      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative mb-4">
                <img
                  src={club.imageUrl}
                  alt={club.arabicName}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  نادي
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{club.arabicName}</h3>
              <p className="text-white/80 text-sm mb-4 line-clamp-2">{club.description}</p>

              <div className="space-y-2 text-sm text-white/70 mb-4">
                <div className="flex items-center">
                  <Users size={16} className="ml-2" />
                  {club.departments?.length || 0} أقسام متاحة
                </div>
                {club.departments && club.departments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {club.departments.slice(0, 3).map((dept) => (
                      <span
                        key={dept.id}
                        className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full"
                      >
                        {dept.arabicName}
                      </span>
                    ))}
                    {club.departments.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                        +{club.departments.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedClub(club)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
              >
                الانضمام للنادي
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/50" />
          <h3 className="text-lg font-medium text-white mb-2">لا توجد نوادي متاحة حالياً</h3>
          <p className="text-white/70">سيتم إضافة نوادي جديدة قريباً</p>
        </div>
      )}

      {/* Club Application Modal */}
      {selectedClub && (
        <ClubApplicationModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </motion.div>
  );
};

export default ClubList;