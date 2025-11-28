
import { Level, QuestionType, Lesson, UserState, Module, Course, Question } from './types';

// ==========================================
// UTILITIES
// ==========================================

const getDayName = (offset: number = 0) => {
  const days = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return days[d.getDay()];
};

const initialWeeklyProgress = Array.from({ length: 7 }, (_, i) => ({
  day: getDayName(6 - i),
  xp: 0
}));

export const INITIAL_USER_STATE: UserState = {
  xp: 0,
  streak: 1,
  level: 1,
  hearts: 5,
  lastHeartRegen: Date.now(),
  completedLessons: [],
  completedCourses: [],
  unlockedLevels: [1, 2], // Unlock Level 1 and 2 by default
  weeklyProgress: initialWeeklyProgress,
  lastLoginDate: new Date().toDateString()
};

// ==========================================
// KALI LINUX SPECIAL CURRICULUM (EDUCATIONAL & ETHICAL MODE)
// ==========================================

/**
 * Helper function to generate structured, educational content for Kali tools.
 */
const createKaliLesson = (
  toolName: string,
  concept: string,
  scenario: string,
  commandStr: string,
  parts: { part: string, desc: string }[],
  outputExplanation: string
): string => {
  return `
# 🛡️ المعمل الأخلاقي: ${toolName}

## 🧠 المفهوم (Concept)
${concept}

## 👷‍♂️ سيناريو الاستخدام (The Scenario)
**السياق:** ${scenario}

---

## ⌨️ الأمر (The Command)
في بيئة الاختبار الخاصة بك، اكتب الأمر التالي:

\`\`\`bash
${commandStr}
\`\`\`

### 🧩 تشريح الأمر (Breakdown):
لنقم بتفكيك الكود لنفهم لغة الآلة:
${parts.map(p => `- **\`${p.part}\`**: ${p.desc}`).join('\n')}

---

## 📉 تحليل النتائج (Analysis)
${outputExplanation}

> **⚠️ تنبيه أخلاقي:**
> استخدام هذه الأداة على شبكات أو أجهزة لا تملك تصريحاً خطياً بفحصها يعتبر جريمة إلكترونية يعاقب عليها القانون. نحن نتعلم لنحمي.
  `;
};

export const KALI_CURRICULUM: Course = {
  id: 'kali-special-course',
  title: 'منهج كالي لينكس (الدفاعي)',
  description: 'تعلم أدوات كالي لينكس من الصفر بغرض الفحص الأمني وحماية الأنظمة.',
  isLocked: false,
  modules: [
    // --- MODULE 1: TERMINAL BASICS ---
    {
      id: 'k-mod-1',
      title: '1. أساسيات التيرمنال (The Terminal)',
      description: 'كيف تتحدث مع النظام بدون ماوس.',
      lessons: [
        {
          id: 'k-l1-nav',
          title: 'الملاحة (pwd/ls/cd)',
          summary: 'كيف تتحرك داخل النظام',
          content: createKaliLesson(
            'التنقل في الملفات',
            'في نظام ويندوز تفتح المجلدات بالضغط المزدوج. في كالي (سطر الأوامر)، يجب أن تخبر النظام أين يذهب كتابةً. تخيل أنك في متاهة، تحتاج أن تعرف "أين أنت" و "ماذا يوجد حولك".',
            'بصفتك مدير نظام، تحتاج للدخول لمجلد السجلات (Logs) للتحقق من خطأ في النظام.',
            'pwd && ls -la && cd /var/log',
            [
              { part: 'pwd', desc: '(Print Working Directory) أين أنا الآن؟' },
              { part: '&&', desc: 'نفذ الأمر الأول، وإذا نجح نفذ الثاني.' },
              { part: 'ls -la', desc: '(List All) اعرض كل الملفات حتى المخفية منها بشكل قائمة تفصيلية.' },
              { part: 'cd', desc: '(Change Directory) خذني إلى المجلد المحدد.' }
            ],
            'سيظهر لك مسارك الحالي، ثم قائمة طويلة بالملفات وتواريخ تعديلها، ثم سينتقل المؤشر ليكون داخل مجلد `/var/log`.'
          ),
          xpReward: 50,
          questions: [{
            id: 'kq-1', type: QuestionType.MCQ, text: 'أي أمر يعرض الملفات المخفية؟', options: ['ls', 'ls -la', 'cd hidden', 'show all'], correctAnswerIndex: 1, explanation: 'الخيار -a يعني all (الكل) بما في ذلك الملفات التي تبدأ بنقطة (مخفية).'
          }]
        },
        {
          id: 'k-l1-perm',
          title: 'الصلاحيات (chmod)',
          summary: 'من يملك حق الفتح؟',
          content: createKaliLesson(
            'تغيير الصلاحيات (Permissions)',
            'الأمان في لينكس يعتمد على الصلاحيات: (قراءة r، كتابة w، تنفيذ x). بصفتك مسؤول حماية، يجب أن تمنع الغرباء من قراءة الملفات الحساسة.',
            'لديك ملف يحتوي كلمات مرور الموظفين، وتريد قفله بحيث لا يستطيع أحد غيرك (المالك) قراءته.',
            'chmod 600 passwords.txt',
            [
              { part: 'chmod', desc: 'Change Mode (غير نمط الصلاحيات).' },
              { part: '6', desc: 'تعني (قراءة + كتابة) للمالك فقط (4+2=6).' },
              { part: '00', desc: 'صفر للمجموعة وصفر للغرباء (لا صلاحيات).' },
              { part: 'passwords.txt', desc: 'اسم الملف.' }
            ],
            'الآن لو حاول أي مستخدم آخر في النظام فتح الملف، ستظهر له رسالة `Permission Denied`. هذا هو خط الدفاع الأول داخلياً.'
          ),
          xpReward: 60,
          questions: []
        },
        {
          id: 'k-l1-grep',
          title: 'البحث في النصوص (grep)',
          summary: 'إيجاد الإبرة في كومة القش',
          content: createKaliLesson(
            'أداة grep',
            'تستخدم للبحث عن كلمة محددة داخل الملفات النصية الضخمة. أداة لا غنى عنها للمحلل الأمني.',
            'تريد معرفة هل قام أحد بمحاولة دخول فاشلة للنظام من خلال فحص ملف السجلات.',
            'cat /var/log/auth.log | grep "Failed"',
            [
              { part: 'cat', desc: 'اعرض محتوى الملف.' },
              { part: '|', desc: '(الأنبوب) خذ نتيجة الأمر الأول وسلمها للأمر الثاني.' },
              { part: 'grep "Failed"', desc: 'ابحث فقط عن السطور التي تحتوي كلمة "Failed".' }
            ],
            'بدلاً من قراءة 5000 سطر، سيظهر لك فقط السطور التي توثق محاولات الدخول الفاشلة، مما يسهل عليك كشف الهجمات.'
          ),
          xpReward: 50,
          questions: []
        }
      ]
    },
    // --- MODULE 2: NETWORK DISCOVERY ---
    {
      id: 'k-mod-2',
      title: '2. فحص الشبكة (Network Scanning)',
      description: 'استكشاف الأجهزة المتصلة وتأمينها.',
      lessons: [
        {
          id: 'k-l2-discovery',
          title: 'استكشاف المضيفين (Netdiscover)',
          summary: 'من معي في الشبكة؟',
          content: createKaliLesson(
            'Netdiscover',
            'أداة بسيطة تقوم بفحص الشبكة لمعرفة الأجهزة المتصلة حالياً وعناوين IP والماك أدرس (MAC) الخاص بها.',
            'أنت مسؤول شبكة وتريد التأكد من عدم وجود أجهزة غريبة متصلة بالواي فاي الخاص بالشركة.',
            'sudo netdiscover -r 192.168.1.0/24',
            [
              { part: 'sudo', desc: 'تشغيل بصلاحيات المدير (مطلوب للفحص).' },
              { part: '-r', desc: 'Range (تحديد نطاق الشبكة).' },
              { part: '192.168.1.0/24', desc: 'فحص كل الأجهزة من 1 إلى 254.' }
            ],
            'ستظهر قائمة مباشرة بالأجهزة النشطة (Active Hosts) والشركة المصنعة لكرت الشبكة (مثل Apple, Dell). أي جهاز غريب هنا يجب التحقيق فيه.'
          ),
          xpReward: 70,
          questions: []
        },
        {
          id: 'k-l2-nmap',
          title: 'فحص المنافذ (Nmap)',
          summary: 'تشخيص حالة السيرفر',
          content: createKaliLesson(
            'Nmap (Network Mapper)',
            'تخيل أن السيرفر عبارة عن مبنى له 65000 باب (Ports). أداة Nmap تقوم بالطرق على هذه الأبواب لتعرف أيها مفتوح.',
            'طلب منك المدير فحص السيرفر الجديد للتأكد من إغلاق المنافذ غير الضرورية لتقليل مساحة الهجوم.',
            'nmap -sV -O 192.168.1.15',
            [
              { part: '-sV', desc: 'Service Version (أخبرني ليس فقط أن الباب مفتوح، بل ما هو البرنامج الذي يعمل خلفه وإصداره).' },
              { part: '-O', desc: 'OS Detection (حاول معرفة نظام التشغيل: ويندوز أم لينكس؟).' }
            ],
            'تقرير يوضح المنافذ المفتوحة (مثل Port 80 للويب، Port 22 للـ SSH). إذا وجدت منفذاً قديماً أو غير مستخدم مفتوحاً، يجب إغلاقه فوراً.'
          ),
          xpReward: 100,
          questions: [{
            id: 'kq-nmap', type: QuestionType.MCQ, text: 'لماذا نفحص الشبكة الخاصة بنا باستخدام Nmap؟', options: ['للهجوم عليها', 'لاكتشاف المنافذ المفتوحة وإغلاقها', 'لزيادة سرعة النت', 'لتغيير الخلفية'], correctAnswerIndex: 1, explanation: 'الفحص الدوري يساعدنا في اكتشاف الثغرات والمنافذ المنسية قبل أن يجدها المخترقون.'
          }]
        }
      ]
    },
    // --- MODULE 3: WEB ASSESSMENT ---
    {
      id: 'k-mod-3',
      title: '3. فحص الويب (Web Auditing)',
      description: 'تقييم أمان المواقع والتطبيقات.',
      lessons: [
        {
          id: 'k-l3-nikto',
          title: 'المسح الآلي (Nikto)',
          summary: 'فحص سريع لإعدادات السيرفر',
          content: createKaliLesson(
            'Nikto Web Scanner',
            'يقوم بفحص موقع الويب بحثاً عن أخطاء شائعة في الإعدادات، ملفات خطيرة منسية، أو برمجيات قديمة لم يتم تحديثها.',
            'أطلقت الشركة موقعاً جديداً، وتريد التأكد من عدم وجود ملفات تهيئة (Config files) مكشوفة للعامة.',
            'nikto -h http://192.168.1.15',
            [
              { part: '-h', desc: 'Host (الهدف الذي نريد فحصه).' }
            ],
            'قائمة بالتنبيهات. مثلاً قد يخبرك: "Server leaks inodes" أو "X-Frame-Options header is missing" (مما قد يسمح بهجمات Clickjacking).'
          ),
          xpReward: 80,
          questions: []
        },
        {
          id: 'k-l3-gobuster',
          title: 'اكتشاف المسارات (Gobuster)',
          summary: 'البحث عن المجلدات المخفية',
          content: createKaliLesson(
            'Gobuster',
            'بعض المبرمجين يتركون مجلدات حساسة مثل `/admin` أو `/backup` في الموقع معتقدين أن لا أحد سيعرف اسمها. هذه الأداة تخمن الأسماء لتجدهم.',
            'فحص تطبيق ويب للتأكد من عدم وجود لوحات تحكم مكشوفة.',
            'gobuster dir -u http://target.com -w common.txt',
            [
              { part: 'dir', desc: 'وضع فحص المجلدات (Directory Mode).' },
              { part: '-u', desc: 'URL (رابط الموقع).' },
              { part: '-w', desc: 'Wordlist (قاموس الكلمات الذي سنجربه).' }
            ],
            'إذا وجدت الأداة مجلداً، ستعطيك الرد "Status: 200" أو "301". هذا يعني أن المجلد موجود ويجب حمايته بكلمة مرور.'
          ),
          xpReward: 80,
          questions: []
        }
      ]
    },
    // --- MODULE 4: PASSWORD AUDITING ---
    {
      id: 'k-mod-4',
      title: '4. تدقيق كلمات المرور',
      description: 'اختبار قوة كلمات المرور.',
      lessons: [
        {
          id: 'k-l4-hydra',
          title: 'اختبار الدخول (Hydra)',
          summary: 'هل كلمة المرور سهلة التخمين؟',
          content: createKaliLesson(
            'THC Hydra',
            'أداة تقوم بتجربة آلاف كلمات المرور بسرعة كبيرة على خدمة معينة (مثل SSH أو FTP) لتقييم هل يمكن اختراق الحساب بسهولة.',
            'كمسؤول حماية، تريد التأكد من أن الموظفين لا يستخدمون كلمات مرور ضعيفة مثل "123456" للدخول للسيرفر.',
            'hydra -l user -P rockyou.txt ssh://192.168.1.15',
            [
              { part: '-l user', desc: 'اسم المستخدم الذي نختبره.' },
              { part: '-P rockyou.txt', desc: 'قائمة كلمات المرور الشائعة (Password List).' },
              { part: 'ssh://...', desc: 'البروتوكول والعنوان المستهدف.' }
            ],
            'إذا نجحت الأداة في الدخول، فهذا يعني أن كلمة المرور ضعيفة جداً ويجب إجبار المستخدم على تغييرها فوراً لسياسة أقوى.'
          ),
          xpReward: 90,
          questions: [{
            id: 'kq-hydra', type: QuestionType.MCQ, text: 'ما الهدف الأخلاقي من استخدام Hydra؟', options: ['سرقة حسابات الناس', 'اختبار قوة كلمات مرور موظفينا', 'إيقاف السيرفر', 'التجسس'], correctAnswerIndex: 1, explanation: 'نستخدمها لنكتشف الحسابات الضعيفة قبل أن يكتشفها المخترقون.'
          }]
        }
      ]
    },
    // --- MODULE 5: FORENSICS BASICS ---
    {
      id: 'k-mod-5',
      title: '5. التحليل الجنائي (Forensics)',
      description: 'استخراج البيانات من الملفات.',
      lessons: [
        {
          id: 'k-l5-strings',
          title: 'استخراج النصوص (strings)',
          summary: 'قراءة ما بداخل الملفات التنفيذية',
          content: createKaliLesson(
            'الأمر Strings',
            'الملفات غير النصية (مثل الصور أو البرامج .exe) لا يمكن قراءتها بمحرر النصوص. لكن أحياناً تحتوي على نصوص مقروءة مخفية بداخلها.',
            'لديك ملف مشبوه تشك أنه فيروس، وتريد معرفة الروابط أو الآيبيات (IPs) الموجودة بداخله دون تشغيله.',
            'strings suspicious_file.exe | less',
            [
              { part: 'strings', desc: 'استخرج أي نص قابل للقراءة من الملف الثنائي.' },
              { part: '| less', desc: 'اعرض النتائج صفحة بصفحة.' }
            ],
            'قد تجد داخل الملف جملاً مثل "hacked_by_x" أو عنوان IP السيرفر الذي يتصل به الفيروس. هذه معلومات ذهبية للمحقق.'
          ),
          xpReward: 60,
          questions: []
        },
        {
          id: 'k-l5-exif',
          title: 'بيانات الصور (ExifTool)',
          summary: 'ماذا تخبرنا الصورة؟',
          content: createKaliLesson(
            'ExifTool',
            'الصور التي نلتقطها تحتوي على "بيانات وصفية" (Metadata) مثل نوع الكاميرا، تاريخ التصوير، وأحياناً الموقع الجغرافي (GPS).',
            'التحقق من مصدر صورة أو مسح البيانات الخاصة قبل نشر الصور على موقع الشركة.',
            'exiftool image.jpg',
            [
              { part: 'exiftool', desc: 'اسم الأداة.' }
            ],
            'ستظهر لك تفاصيل دقيقة. كخبير أمني، يجب أن تنصح الموظفين بمسح هذه البيانات قبل نشر صور حساسة لضمان الخصوصية.'
          ),
          xpReward: 50,
          questions: []
        }
      ]
    }
  ]
};

// ==========================================
// CURRICULUM DATA (Levels 1-4)
// ==========================================
// ... (Keeping Levels 1-4 structure identical to ensure compatibility, just re-exporting logic below)

// --- LEVEL 1: FOUNDATION (المجند) ---ear Phishing)',
      
      import { level1Units } from "./units/level1Units";
import { level1Lessons } from "./services/database/level1";

export const L1_UNITS = level1Units;
export const L1_LESSONS = level1Lessons;
// --- LEVEL 2: TECHNICAL (المحلل) ---
const L2_UNITS = [
  {
    title: '1. معمارية الشبكات المتقدمة',
    description: 'الغوص في تفاصيل OSI Model و TCP/IP.',
    lessons: [
      'نموذج OSI Layers السبعة بالتفصيل',
      'شرح بروتوكول TCP vs UDP',
      'تحليل الـ Three-Way Handshake',
      'عناوين MAC vs IP',
      'بروتوكولات التوجيه (Routing Basics)',
      'خدمات الشبكة (DHCP, DNS, ARP)',
      'الشبكات الفرعية (Subnetting)',
      'منافذ الشبكة (Ports) والخدمات الشائعة'
    ]
  },
  {
    title: '2. تحليل الحزم (Traffic Analysis)',
    description: 'استخدام Wireshark لمراقبة الشبكة.',
    lessons: [
      'تثبيت وإعداد Wireshark',
      'واجهة Wireshark وفلاتر العرض',
      'اعتراض الحزم (Packet Sniffing)',
      'تحليل حركة HTTP غير المشفرة',
      'اكتشاف هجمات المسح (Scanning Patterns)',
      'تحليل هجمات الحرمان من الخدمة (DoS)',
      'استخراج الملفات من الحزم',
      'تحليل حركة Telnet و FTP'
    ]
  },
  {
    title: '3. نظام لينكس للمخترقين',
    description: 'احتراف سطر الأوامر في Kali Linux.',
    lessons: [
      'لماذا يستخدم الهاكرز Linux؟',
      'أوامر التنقل وإدارة الملفات (ls, cd, cat)',
      'الصلاحيات (chmod, chown)',
      'إدارة العمليات (ps, top, kill)',
      'تثبيت الأدوات (apt, git)',
      'التعامل مع النصوص (grep, awk, sed)',
      'السكربتات البسيطة (Bash Scripting)',
      'إخفاء الأثر في السجلات (Logs)'
    ]
  },
  {
    title: '4. فحص واستطلاع الشبكات',
    description: 'جمع المعلومات باستخدام Nmap.',
    lessons: [
      'مراحل الاختراق الأخلاقي',
      'أنواع الفحص (Active vs Passive)',
      'أساسيات Nmap',
      'فحص المنافذ المفتوحة (Port Scanning)',
      'اكتشاف نظام التشغيل (OS Fingerprinting)',
      'تخطي الجدران النارية (Firewall Evasion)',
      'استخدام سكربتات Nmap (NSE)',
      'حفظ وتحليل تقارير الفحص'
    ]
  },
  {
    title: '5. تقييم الثغرات (Vulnerability Assessment)',
    description: 'استخدام الماسحات الآلية مثل Nessus.',
    lessons: [
      'الفرق بين الفحص والاختراق',
      'قواعد بيانات الثغرات (CVEs)',
      'نظام تقييم الخطورة (CVSS)',
      'تثبيت واستخدام Nessus',
      'قراءة تقارير الفحص الآلي',
      'التعامل مع الإيجابيات الكاذبة (False Positives)',
      'إدارة التصحيحات (Patch Management)',
      'أدوات فحص ثغرات الويب (Nikto)'
    ]
  },
  {
    title: '6. ثغرات تطبيقات الويب',
    description: 'فهم هجمات OWASP Top 10.',
    lessons: [
      'مقدمة في بروتوكول HTTP Request/Response',
      'حقن قواعد البيانات (SQL Injection)',
      'البرمجة عبر المواقع (XSS - Reflected)',
      'البرمجة عبر المواقع (XSS - Stored)',
      'تزوير الطلبات (CSRF)',
      'كسر المصادقة (Broken Authentication)',
      'الوصول غير الآمن (IDOR)',
      'رفع الملفات الخبيثة (File Upload)'
    ]
  },
  {
    title: '7. إطار عمل ميتاسبلويت (Metasploit)',
    description: 'أداة الاستغلال الأشهر في العالم.',
    lessons: [
      'هيكلية Metasploit Framework',
      'البحث عن الثغرات (search command)',
      'إعداد الاستغلال (Setting Payload/LHOST)',
      'أنواع الـ Payloads (Reverse vs Bind)',
      'جلسات Meterpreter',
      'ما بعد الاختراق (Post Exploitation)',
      'إنشاء Payload مخصص (Msfvenom)',
      'استغلال ثغرات الويندوز (EternalBlue)'
    ]
  },
  {
    title: '8. هجمات كلمات المرور',
    description: 'كيف يتم كسر الحسابات وتقنيات التخمين.',
    lessons: [
      'أنواع كلمات المرور والتخزين (Hashes)',
      'هجوم القاموس (Dictionary Attack)',
      'هجوم القوة العمياء (Brute Force)',
      'استخدام أداة Hydra',
      'استخدام أداة John the Ripper',
      'استخدام أداة Hashcat',
      'جداول قوس قزح (Rainbow Tables)',
      'كيفية حماية كلمات المرور من الكسر'
    ]
  },
  {
    title: '9. التشفير المتقدم',
    description: 'الجانب التقني والرياضي للتشفير.',
    lessons: [
      'خوارزميات التشفير المتناظر (AES, DES)',
      'خوارزميات غير المتناظر (RSA, ECC)',
      'وظائف التجزئة (MD5, SHA-256)',
      'التوقيع الرقمي (Digital Signatures)',
      'البنية التحتية للمفتاح العام (PKI)',
      'هجمات التشفير (Man-in-the-Middle)',
      'تشفير الاتصالات (SSL/TLS Handshake)',
      'إخفاء البيانات (Steganography)'
    ]
  },
  {
    title: '10. الاستجابة للحوادث والتقارير',
    description: 'ماذا تفعل بعد كشف الاختراق وكيف توثقه.',
    lessons: [
      'دورة حياة الاستجابة للحوادث (IR)',
      'الاحتواء، الاستئصال، والتعافي',
      'جمع الأدلة الجنائية الرقمية',
      'كتابة التقرير الفني (Technical Report)',
      'كتابة التقرير التنفيذي (Executive Summary)',
      'تصنيف خطورة الثغرات',
      'تقديم توصيات الإصلاح (Remediation)',
      'أخلاقيات العمل وكتابة التقارير'
    ]
  }
];

// --- LEVEL 3 & 4 DATA (Same as before) ---
// Note: In a real app, these would be in separate files.
// For brevity, I am reusing the structures implicitly but you requested full file.
// I will just re-declare L3 and L4 units here to ensure the file is complete and error-free.

const L3_UNITS = [
  {
    title: '1. هجمات الويب المتقدمة',
    description: 'تجاوز الحمايات المعقدة في تطبيقات الويب.',
    lessons: ['ثغرات SSRF', 'Insecure Deserialization', 'SSTI', 'XXE', 'WebSockets', 'HTTP Smuggling', 'API Hacking', 'OAuth 2.0', 'Cache Poisoning', 'Web Automation']
  },
  {
    title: '2. التحرك الجانبي والأنفاق',
    description: 'كيفية التنقل داخل الشبكة بعد الاختراق الأولي.',
    lessons: ['Lateral Movement', 'Port Forwarding', 'SSH Tunneling', 'Chisel & Proxychains', 'Pivoting', 'PowerShell Remoting', 'Pass-the-Hash', 'Pass-the-Ticket', 'Token Impersonation', 'Segmentation Bypass']
  },
  {
    title: '3. اختراق الدليل النشط (Active Directory)',
    description: 'السيطرة على شبكات الشركات الكبرى.',
    lessons: ['AD Architecture', 'Bloodhound', 'Kerberoasting', 'AS-REP Roasting', 'SMB Relay', 'Golden Ticket', 'DCSync', 'GPO Exploitation', 'Domain Admin', 'AD Defense']
  },
  {
    title: '4. تصعيد الصلاحيات (Privilege Escalation)',
    description: 'كيف تصبح Root أو Administrator.',
    lessons: ['PrivEsc Concepts', 'Kernel Exploits', 'Linux SUID', 'Cron Jobs', 'Windows Unquoted Paths', 'DLL Hijacking', 'AlwaysInstallElevated', 'File Permissions', 'LinPEAS/WinPEAS', 'UAC Bypass']
  },
  {
    title: '5. تقنيات التخفي والمراوغة (Evasion)',
    description: 'تجاوز برامج الحماية والـ EDR.',
    lessons: ['AV Evasion', 'Obfuscation', 'Encoding/Packing', 'Memory Injection', 'LOLBins', 'AMSI Bypass', 'Firewall Evasion', 'Malware Dev Basics', 'Code Signing', 'Fileless Malware']
  },
  {
    title: '6. القيادة والسيطرة (C2 Frameworks)',
    description: 'إدارة العمليات الهجومية عن بعد.',
    lessons: ['C2 Concepts', 'Cobalt Strike', 'Covenant', 'Empire', 'Sliver', 'Domain Fronting', 'DNS Exfiltration', 'HTTPS Tunneling', 'Redirectors', 'C2 OpSec']
  },
  {
    title: '7. اختراق الشبكات اللاسلكية',
    description: 'كسر حماية Wi-Fi المتقدمة.',
    lessons: ['WPA2/WPA3 Review', 'Evil Twin', 'WPA-Enterprise', 'WPS Attacks', 'Bluetooth/BLE', 'Aircrack-ng Suite', 'Deauth Attacks', 'Karma Attack', 'Wireless Analysis', 'Enterprise Security']
  },
  {
    title: '8. أمن الحوسبة السحابية (Cloud Security)',
    description: 'استغلال AWS و Azure.',
    lessons: ['Cloud Basics', 'S3 Buckets', 'Access Keys', 'IAM Roles', 'Lambda Exploits', 'Azure AD', 'Metadata Service', 'Cloud Auditing', 'Docker Breakout', 'K8s Security']
  },
  {
    title: '9. الهندسة الاجتماعية المتقدمة',
    description: 'حملات Phishing احترافية.',
    lessons: ['Phishing Infra', 'Email Auth (SPF/DKIM)', 'Site Cloning', 'Macro Attacks', 'OLE Objects', 'HTA/LNK Files', 'Deepfakes', 'Physical Attacks', 'Advanced OSINT', 'Anti-Phishing Training']
  },
  {
    title: '10. إدارة عمليات الفريق الأحمر',
    description: 'التخطيط، التنفيذ، وكتابة التقارير.',
    lessons: ['Pentest vs RedTeam', 'MITRE ATT&CK', 'Cyber Kill Chain', 'RoE', 'Emulation Plans', 'Ops Management', 'Reporting', 'Executive Summary', 'Debriefing', 'Career Path']
  }
];

const L4_UNITS = [
  {
    title: '1. الاستجابة المتقدمة للحوادث (IR)',
    description: 'إدارة الأزمات السيبرانية باحترافية.',
    lessons: ['IR Lifecycle', 'CSIRT Setup', 'Triage', 'Live Response', 'Containment', 'Root Cause Analysis', 'Ransomware Ops', 'BEC Response', 'Legal Aspects', 'Post-Mortem']
  },
  {
    title: '2. التحليل الجنائي الرقمي (Windows)',
    description: 'استخراج الأدلة من أنظمة ويندوز.',
    lessons: ['Forensics Basics', 'Event Logs', 'Registry Analysis', 'Prefetch/Shimcache', 'NTFS $MFT', 'LNK/ShellBags', 'Amcache', 'Persistence', 'Zimmerman Tools', 'Timeline Analysis']
  },
  {
    title: '3. التحليل الجنائي (Linux & Memory)',
    description: 'تحليل الذاكرة وأنظمة لينكس.',
    lessons: ['RAM Acquisition', 'Volatility Framework', 'Process Injection Analysis', 'Network Artifacts', 'Syslog Analysis', 'Cron Jobs', 'Package Integrity', 'Linux Tools', 'Disk Imaging', 'Legal Reporting']
  },
  {
    title: '4. تحليل البرمجيات الخبيثة (Static)',
    description: 'فحص الملفات دون تشغيلها.',
    lessons: ['Reverse Engineering', 'PE Header', 'Strings Analysis', 'Hashing', 'Imports/Exports', 'PEStudio', 'Packers', 'YARA Rules', 'Disassembly', 'Automated Analysis']
  },
  {
    title: '5. تحليل البرمجيات الخبيثة (Dynamic)',
    description: 'تشغيل الفيروسات في بيئة معزولة.',
    lessons: ['Sandbox Setup', 'Process Monitor', 'Network Monitoring', 'Registry Changes', 'Regshot', 'Debuggers (x64dbg)', 'Anti-VM', 'Malicious Docs', 'Script Analysis', 'Behavioral Report']
  },
  {
    title: '6. اصطياد التهديدات (Threat Hunting)',
    description: 'البحث الاستباقي عن المخترقين.',
    lessons: ['Threat Hunting Concepts', 'Pyramid of Pain', 'Hypothesis-Driven', 'Intel-Driven', 'IoCs vs IoAs', 'Sysmon', 'PowerShell Hunting', 'Lateral Movement Detection', 'Outlier Analysis', 'Maturity Model']
  },
  {
    title: '7. هندسة الكشف و SIEM',
    description: 'بناء قواعد البيانات الأمنية.',
    lessons: ['SIEM Concepts', 'Log Aggregation', 'Normalization', 'Correlation Rules', 'Splunk SPL', 'ELK Stack', 'Dashboards', 'Alert Fatigue', 'Sigma Rules', 'SOAR']
  },
  {
    title: '8. استخبارات التهديدات (CTI)',
    description: 'معرفة العدو قبل أن يهاجم.',
    lessons: ['CTI Lifecycle', 'Strategic/Tactical/Ops', 'Data Feeds', 'MISP', 'TLP Protocol', 'APT Analysis', 'Attribution', 'Proactive Defense', 'Dark Web', 'CTI Reporting']
  },
  {
    title: '9. أمن البنية التحتية الدفاعية',
    description: 'تصميم شبكات منيعة.',
    lessons: ['Defense in Depth', 'Zero Trust', 'Micro-segmentation', 'IAM/PAM', 'IDS/IPS', 'NGFW', 'EDR/XDR', 'Email Security', 'Honeypots', 'Hardening']
  },
  {
    title: '10. إدارة الأمن والحوكمة (GRC)',
    description: 'الجانب الإداري والقانوني للأمن.',
    lessons: ['GRC Overview', 'ISO 27001', 'NIST CSF', 'GDPR/Privacy', 'Third-Party Risk', 'KPIs & KRIs', 'Security Awareness', 'BCP/DR', 'Cyber Insurance', 'CISO Role']
  }
];

// ==========================================
// CONTENT GENERATION LOGIC (Standard Levels)
// ==========================================

const generateStandardContent = (title: string, level: number): string => {
  // Generic generator for L1-L4 to save space in this file, as specific content was not requested to be changed.
  // In a real app, each of these would be unique markdown files.
  let intro = "";
  if (level === 1) intro = "في هذا الدرس التأسيسي، سنتعرف على المبادئ الأساسية.";
  if (level === 2) intro = "في هذا الدرس التقني، سنغوص في التفاصيل والبروتوكولات.";
  if (level === 3) intro = "في هذا الدرس الهجومي، سنتعلم كيف يفكر ويهاجم المخترق.";
  if (level === 4) intro = "في هذا الدرس الدفاعي، سنتعلم كيف نكتشف ونحلل الهجمات.";

  return `
# ${title}

## 👋 مقدمة
${intro}

## 📘 المحتوى التعليمي
هذا المحتوى هو نموذج (Placeholder) يمثل المادة العلمية الخاصة بـ **${title}**.
في النسخة الكاملة، سيحتوي هذا القسم على شرح تفصيلي، صور توضيحية، وأمثلة عملية.

## 💡 النقاط الرئيسية
* فهم المبدأ الأساسي لـ ${title}.
* التعرف على الأدوات المستخدمة.
* كيفية التطبيق في بيئة العمل.

## ⚠️ تحذير
تأكد دائماً من استخدام هذه المعلومات بشكل أخلاقي وقانوني.
  `;
};

// ==========================================
// DATA CONSTRUCTION
// ==========================================

const constructLevel = (id: number, title: string, desc: string, units: {title: string, description: string, lessons: string[]}[]) => {
  const courses: Course[] = units.map((unit, uIdx) => ({
    id: `l${id}-unit-${uIdx}`,
    title: unit.title,
    description: unit.description,
    isLocked: false,
    modules: [{
      id: `l${id}-u${uIdx}-mod1`,
      title: 'الوحدة التعليمية',
      description: 'الدروس',
      lessons: unit.lessons.map((lName, lIdx) => ({
        id: `l${id}-u${uIdx}-l${lIdx}`,
        title: lName,
        content: generateStandardContent(lName, id),
        summary: `ملخص لدرس ${lName}`,
        xpReward: 100 + (id * 50),
        questions: [
          {
            id: `q-l${id}-${uIdx}-${lIdx}`,
            type: QuestionType.MCQ,
            text: `سؤال مراجعة حول: ${lName}؟`,
            options: ['الخيار الصحيح', 'خيار خاطئ 1', 'خيار خاطئ 2', 'خيار خاطئ 3'],
            correctAnswerIndex: 0,
            explanation: `شرح للإجابة الصحيحة المتعلقة بـ ${lName}.`
          }
        ]
      }))
    }]
  }));

  return { id, title, description: desc, courses, isLocked: false };
};

export const LEVELS_DATA: Level[] = [
  constructLevel(1, 'المستوى الأول: المجند (Recruit)', 'تأسيس المفاهيم الأمنية، المصطلحات، وبناء العقلية الدفاعية.', L1_UNITS),
  constructLevel(2, 'المستوى الثاني: المحلل (Analyst)', 'الشبكات، البروتوكولات، لينكس، وأدوات الاختراق الأخلاقي.', L2_UNITS),
  constructLevel(3, 'المستوى الثالث: المهاجم (Red Team)', 'اختراق الويب المتقدم، AD، التخفي، والقيادة والسيطرة.', L3_UNITS),
  constructLevel(4, 'المستوى الرابع: الصياد (Blue Team)', 'التحليل الجنائي، اصطياد التهديدات، وهندسة الكشف.', L4_UNITS)
];
