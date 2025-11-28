import { level1Lessons } from "../services/database/level1";

export type UnitMeta = {
  id: number;
  level: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  lessonIds: string[];
};

export const level1Units: UnitMeta[] = [
  {
    id: 1,
    level: 1,
    titleAr: "مدخل إلى الأمن السيبراني",
    titleEn: "Introduction to Cybersecurity",
    descriptionAr: "المفاهيم الأساسية، CIA Triad، ولماذا نحمي البيانات.",
    descriptionEn: "Core cybersecurity concepts and why data protection matters.",
    lessonIds: level1Lessons.filter((l) => l.unit === 1).map((l) => l.id),
  },
  {
    id: 2,
    level: 1,
    titleAr: "قراصنة الإنترنت (Hackers)",
    titleEn: "Hackers Basics",
    descriptionAr: "من هم؟ كيف يفكرون؟ وما هي دوافعهم الأساسية؟",
    descriptionEn: "Who hackers are and how they think.",
    lessonIds: level1Lessons.filter((l) => l.unit === 2).map((l) => l.id),
  },
  {
    id: 3,
    level: 1,
    titleAr: "البرمجيات الخبيثة (Malware)",
    titleEn: "Malware Fundamentals",
    descriptionAr: "أنواع البرمجيات الخبيثة وكيف تنتشر وكيف نميزها.",
    descriptionEn: "Types of malware and how they spread.",
    lessonIds: level1Lessons.filter((l) => l.unit === 3).map((l) => l.id),
  },
  {
    id: 4,
    level: 1,
    titleAr: "الهندسة الاجتماعية الأساسية",
    titleEn: "Social Engineering Basics",
    descriptionAr: "خداع العقول بدل اختراق الأنظمة، وأهم أساليب الإقناع.",
    descriptionEn: "Basic techniques of social engineering attacks.",
    lessonIds: level1Lessons.filter((l) => l.unit === 4).map((l) => l.id),
  },
  {
    id: 5,
    level: 1,
    titleAr: "أساسيات الشبكات للمختص السيبراني",
    titleEn: "Networking Fundamentals",
    descriptionAr: "المفاهيم الأساسية للشبكات التي يحتاجها أي مدافع سيبراني.",
    descriptionEn: "Networking basics for cybersecurity.",
    lessonIds: level1Lessons.filter((l) => l.unit === 5).map((l) => l.id),
  },
  {
    id: 6,
    level: 1,
    titleAr: "أساسيات أنظمة التشغيل والأمن الداخلي",
    titleEn: "Operating Systems & Internal Security",
    descriptionAr: "كيف يعمل النظام من الداخل، والملفات، والصلاحيات، والخدمات.",
    descriptionEn: "OS internals and basic system hardening concepts.",
    lessonIds: level1Lessons.filter((l) => l.unit === 6).map((l) => l.id),
  },
  {
    id: 7,
    level: 1,
    titleAr: "إدارة الهويات والصلاحيات",
    titleEn: "Identity & Access Basics",
    descriptionAr: "المستخدمون، الأدوار، والصلاحيات، ومبدأ أقل صلاحية.",
    descriptionEn: "Users, roles, permissions and least privilege.",
    lessonIds: level1Lessons.filter((l) => l.unit === 7).map((l) => l.id),
  },
  {
    id: 8,
    level: 1,
    titleAr: "منهجية المهاجم – الأساسيات",
    titleEn: "Attacker Methodology (Foundations)",
    descriptionAr: "كيف يفكر المهاجم خطوة خطوة من جمع المعلومات حتى استغلال نقطة الضعف.",
    descriptionEn: "High-level attacker kill chain for beginners.",
    lessonIds: level1Lessons.filter((l) => l.unit === 8).map((l) => l.id),
  },
  {
    id: 9,
    level: 1,
    titleAr: "مقدمة البرمجة للمختص السيبراني",
    titleEn: "Programming Intro for Cybersecurity",
    descriptionAr: "المتغيرات، الشروط، الحلقات، والدوال كمفاهيم فقط بدون تعمق.",
    descriptionEn: "Basic programming concepts for security people.",
    lessonIds: level1Lessons.filter((l) => l.unit === 9).map((l) => l.id),
  },
  {
    id: 10,
    level: 1,
    titleAr: "تهيئة الطريق للأمن المتقدم",
    titleEn: "Preparing for Advanced Security",
    descriptionAr: "ربط كل ما تعلّمته في المستوى الأول وتجهيزه للمستويات القادمة.",
    descriptionEn: "Connecting level 1 concepts and preparing for advanced topics.",
    lessonIds: level1Lessons.filter((l) => l.unit === 10).map((l) => l.id),
  },
];
