// خدمات/databaseService.ts
// خدمة ترجع الدروس من مستويات مختلفة (أوفلاين 100%)

// نوع الدرس
export type Lesson = {
  id: string;       // مثال: L1-U1-1
  level: number;    // رقم المستوى: 1..4
  unit: number;     // رقم الوحدة داخل المستوى: 1..10
  order: number;    // رقم الدرس داخل الوحدة: 1..10
  titleAr: string;  // عنوان عربي
  titleEn: string;  // عنوان إنجليزي
  content: string;  // محتوى الدرس (نص طويل)
};

// استيراد دروس المستوى الأول من ملف مستقل
import { level1Lessons } from "./level1";

// هنا لاحقاً نضيف:
// import { level2Lessons } from "./level2";
// import { level3Lessons } from "./level3";
// import { level4Lessons } from "./level4";

const allLessons: Lesson[] = [
  ...level1Lessons,
  // ...level2Lessons,
  // ...level3Lessons,
  // ...level4Lessons,
];

// عدد المستويات الموجودة حالياً
export function getLevels(): number[] {
  // الآن فعلياً شغالين فقط على المستوى الأول
  return [1];
}

// نفترض أن كل مستوى يدعم حتى 10 وحدات (حتى لو بعضها فاضي حالياً)
export function getUnitsByLevel(level: number): number[] {
  return Array.from({ length: 10 }, (_, i) => i + 1);
}

// جلب دروس وحدة معيّنة داخل مستوى معيّن
export function getLessons(level: number, unit: number): Lesson[] {
  return allLessons
    .filter((l) => l.level === level && l.unit === unit)
    .sort((a, b) => a.order - b.order);
}

// جلب درس معيّن بالـ id (لو الشاشة تستخدم id مباشر)
export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

// للتجربة أو الاستخدام العام
export const lessons = allLessons;
