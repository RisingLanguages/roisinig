import { CourseOption, WilayaOption } from '../types';

export const COURSES: CourseOption[] = [
  // Professional Courses
  { id: 'it', name: 'IT', arabicName: 'الإعلام الآلي', category: 'professional' },
  { id: 'programming', name: 'Programming', arabicName: 'البرمجة', category: 'professional' },
  { id: 'cybersecurity', name: 'Cyber Security', arabicName: 'الأمن السيبراني', category: 'professional' },
  { id: 'webdev', name: 'Web Development', arabicName: 'برمجة المواقع', category: 'professional' },
  { id: 'video-editing', name: 'Video Editing', arabicName: 'مونتاج الفيديو', category: 'professional' },
  { id: 'graphic-design', name: 'Graphic Design', arabicName: 'التصميم الجرافيكي', category: 'professional' },
  { id: 'digital-marketing', name: 'Digital Marketing', arabicName: 'التسويق الرقمي', category: 'professional' },
  { id: 'photography', name: 'Photography', arabicName: 'التصوير الفوتوغرافي', category: 'professional' },
  { id: 'accounting', name: 'Accounting', arabicName: 'المحاسبة', category: 'professional' },
  { id: 'trading', name: 'Trading', arabicName: 'التداول', category: 'professional' },
  { id: 'project-management', name: 'Project Management', arabicName: 'إدارة المشاريع', category: 'professional' },
  
  // Language Courses
  { id: 'english', name: 'English', arabicName: 'الإنجليزية', category: 'language' },
  { id: 'french', name: 'French', arabicName: 'الفرنسية', category: 'language' },
  { id: 'spanish', name: 'Spanish', arabicName: 'الإسبانية', category: 'language' },
  { id: 'italian', name: 'Italian', arabicName: 'الإيطالية', category: 'language' },
  { id: 'russian', name: 'Russian', arabicName: 'الروسية', category: 'language' },
  { id: 'german', name: 'German', arabicName: 'الألمانية', category: 'language' },
];

export const WILAYAS: WilayaOption[] = [
  { code: '01', name: 'Adrar' },
  { code: '02', name: 'Chlef' },
  { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' },
  { code: '05', name: 'Batna' },
  { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' },
  { code: '08', name: 'Béchar' },
  { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' },
  { code: '11', name: 'Tamanrasset' },
  { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' },
  { code: '14', name: 'Tiaret' },
  { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Algiers' },
  { code: '17', name: 'Djelfa' },
  { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' },
  { code: '20', name: 'Saïda' },
  { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' },
  { code: '23', name: 'Annaba' },
  { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' },
  { code: '26', name: 'Médéa' },
  { code: '27', name: 'Mostaganem' },
  { code: '28', name: "M'Sila" },
  { code: '29', name: 'Mascara' },
  { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' },
  { code: '32', name: 'El Bayadh' },
  { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' },
  { code: '35', name: 'Boumerdès' },
  { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' },
  { code: '38', name: 'Tissemsilt' },
  { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' },
  { code: '41', name: 'Souk Ahras' },
  { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' },
  { code: '44', name: 'Aïn Defla' },
  { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' },
  { code: '47', name: 'Ghardaïa' },
  { code: '48', name: 'Relizane' },
  { code: '49', name: 'Timimoun' },
  { code: '50', name: 'Bordj Badji Mokhtar' },
  { code: '51', name: 'Ouled Djellal' },
  { code: '52', name: 'Béni Abbès' },
  { code: '53', name: 'In Salah' },
  { code: '54', name: 'In Guezzam' },
  { code: '55', name: 'Touggourt' },
  { code: '56', name: 'Djanet' },
  { code: '57', name: "El M'Ghair" },
  { code: '58', name: 'El Meniaa' },
];

export const EDUCATION_LEVELS = [
  'طالب جامعي',
  'عامل مؤسسة',
  'صاحب مؤسسة',
  'عاطل عن العمل',
  'غير ذلك'
];

export const PAYMENT_METHODS = [
  { id: 'ccp', name: 'CCP', icon: '💳' },
  { id: 'baridimob', name: 'Baridimob', icon: '📱' },
  { id: 'check', name: 'Check', icon: '📄' }
];

export const LANGUAGE_LEVELS = [
  { id: 'beginner', name: 'مبتدئ', description: 'لا أتحدث اللغة' },
  { id: 'elementary', name: 'أساسي', description: 'أعرف كلمات بسيطة' },
  { id: 'intermediate', name: 'متوسط', description: 'أستطيع التحدث بشكل بسيط' },
  { id: 'upper-intermediate', name: 'متوسط متقدم', description: 'أتحدث بطلاقة نسبية' },
  { id: 'advanced', name: 'متقدم', description: 'أتحدث بطلاقة عالية' },
  { id: 'native', name: 'لغة أم', description: 'لغتي الأصلية' }
];

export const HEALTH_PROBLEMS = [
  'مشاكل في السمع',
  'مشاكل في البصر',
  'مشاكل في الحركة',
  'حساسية معينة',
  'مرض مزمن',
  'أخرى'
];

export const CLUB_CONTRACT_TEXT = `
شروط وأحكام الانضمام للنوادي - أكاديمية رايزين

المادة الأولى: التعريفات
- النادي: يقصد به أي نادي تابع لأكاديمية رايزين
- العضو: الشخص المنضم للنادي والموافق على هذه الشروط
- الإدارة: إدارة أكاديمية رايزين

المادة الثانية: شروط العضوية
1. يجب أن يكون المتقدم لا يقل عمره عن 16 سنة
2. تعبئة استمارة التسجيل بالمعلومات الصحيحة
3. الالتزام بقوانين وأنظمة النادي
4. احترام الأعضاء الآخرين والمدربين

المادة الثالثة: حقوق العضو
1. المشاركة في جميع أنشطة النادي
2. الحصول على التدريب والإرشاد
3. استخدام مرافق النادي المتاحة
4. الحصول على شهادة مشاركة

المادة الرابعة: واجبات العضو
1. الحضور المنتظم للأنشطة
2. احترام المواعيد المحددة
3. المحافظة على ممتلكات النادي
4. عدم إزعاج الأعضاء الآخرين

المادة الخامسة: الانسحاب والإلغاء
1. يحق للعضو الانسحاب في أي وقت بإشعار مسبق
2. يحق للإدارة إلغاء العضوية في حالة مخالفة القوانين
3. لا يحق استرداد أي رسوم مدفوعة

بالتوقيع أدناه، أؤكد موافقتي على جميع الشروط والأحكام المذكورة أعلاه.
`;