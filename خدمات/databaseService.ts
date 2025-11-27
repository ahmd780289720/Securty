// خدمات/databaseService.ts
// خدمة بسيطة ترجع الدروس من مصفوفة ثابتة (أوفلاين %100)

export type Lesson = {
  id: string;
  level: number;     // المستوى 1..4
  unit: number;      // 1..10
  order: number;     // 1..10
  titleAr: string;
  titleEn: string;
  content: string;
};

// مؤقتاً: درس واحد للتجربة – بعدين نضيف 100 درس لكل مستوى
export const lessons: Lesson[] = [
  {
    id: "L1-U1-1",
    level: 1,
    unit: 1,
    order: 1,
    titleAr: "ما هو الأمن السيبراني؟",
    titleEn: "What is Cybersecurity?",
    content: `
الأمن السيبراني هو علم حماية الأنظمة الرقمية من الاختراق أو التلاعب.
هذا درس تجريبي فقط، وسنستبدله لاحقاً بمحتوى قصصي كامل ومترابط.
    `.trim(),
  },
];

// دوال مساعدة
export function getLevels(): number[] {
  return [1, 2, 3, 4];
}

export function getUnitsByLevel(level: number): number[] {
  return Array.from({ length: 10 }, (_, i) => i + 1);
}

export function getLessons(level: number, unit: number): Lesson[] {
  return lessons
    .filter((l) => l.level === level && l.unit === unit)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
